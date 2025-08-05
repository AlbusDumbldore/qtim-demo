import { ConflictException, Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { compare, hash } from 'bcrypt';
import { decode, sign, verify } from 'jsonwebtoken';
import { CacheTime } from '../../cache/cache.constants';
import { cacheRefreshToken } from '../../cache/cache.keys';
import { CacheService } from '../../cache/cache.service';
import appConfig from '../../config';
import { User } from '../../database/entities/user.entity';
import { UserService } from '../user/user.service';
import { JwtPayload, TokenPair } from './auth.types';
import { UserLoginRequestBodyDto, UserRegisterRequestBodyDto } from './dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private readonly cacheService: CacheService,
  ) {}

  async register(dto: UserRegisterRequestBodyDto) {
    const exists = await this.userService.findOneByEmail(dto.email);
    if (exists) {
      throw new ConflictException(`User already exists`);
    }

    const hashedPassword = await hash(dto.password, 10);

    const user = await this.userService.create({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
    });

    this.logger.log(`New user registered (id=${user.id}, email="${user.email}")`);

    return user;
  }

  async refresh(refreshToken: string) {
    const valid = this.verify(refreshToken, 'refresh');
    if (!valid) {
      throw new UnauthorizedException();
    }

    const token = await this.cacheService.get<JwtPayload>(cacheRefreshToken(refreshToken));
    if (!token) {
      throw new UnauthorizedException();
    }
    await this.cacheService.delete(cacheRefreshToken(refreshToken));

    const user = await this.userService.findOneById(token.id);
    if (!user) {
      throw new UnauthorizedException();
    }

    return this.upsertTokenPair(user);
  }

  async login(dto: UserLoginRequestBodyDto) {
    const user = await this.userService.findOneByEmail(dto.email);

    if (!user || !(await compare(dto.password, user.password))) {
      throw new UnauthorizedException();
    }

    return this.upsertTokenPair(user);
  }

  verify(token: string, type: 'access' | 'refresh'): boolean {
    const secrets = {
      access: appConfig.jwt.accessSecret,
      refresh: appConfig.jwt.refreshSecret,
    };

    try {
      verify(token, secrets[type]);
      return true;
    } catch (err) {
      return false;
    }
  }

  decode(token: string): JwtPayload {
    const decoded = decode(token, { json: true });

    if (!decoded) {
      throw new UnauthorizedException();
    }

    return decoded as JwtPayload;
  }

  private async upsertTokenPair(user: User): Promise<TokenPair> {
    const payload: JwtPayload = { id: user.id, email: user.email };

    const accessToken = sign(payload, appConfig.jwt.accessSecret, { expiresIn: '1h' });
    const refreshToken = sign(payload, appConfig.jwt.refreshSecret, { expiresIn: '1w' });

    await this.cacheService.set(
      cacheRefreshToken(refreshToken),
      { id: user.id },
      { expiration: { type: 'EX', value: CacheTime.day8 } },
    );

    return { accessToken, refreshToken };
  }
}
