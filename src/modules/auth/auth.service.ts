import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcrypt';
import { sign } from 'jsonwebtoken';
import { Repository } from 'typeorm';
import appConfig from '../../config';
import { User } from '../../database/entities/user.entity';
import { JwtPayload, TokenPair } from './auth.types';
import { UserLoginRequestBodyDto, UserRegisterRequestBodyDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async register(dto: UserRegisterRequestBodyDto) {
    const exists = await this.userRepository.findOne({ where: { email: dto.email } }); // <-- @Todo: Это можно будет в user.service вынести
    if (exists) {
      throw new ConflictException(`User already exists`);
    }

    const hashedPassword = await hash(dto.password, 10);

    const user = await this.userRepository.save({
      name: dto.name,
      email: dto.email,
      password: hashedPassword,
    });

    return user;
  }

  async login(dto: UserLoginRequestBodyDto) {
    const user = await this.userRepository.findOne({ where: { email: dto.email } }); // <-- @Todo: Это можно будет в user.service вынести

    if (!user || !(await compare(dto.password, user.password))) {
      throw new UnauthorizedException();
    }

    return this.createTokenPair(user);
  }

  private createTokenPair(user: User): TokenPair {
    const payload: JwtPayload = { id: user.id, email: user.email };

    const accessToken = sign(payload, appConfig.jwt.accessSecret, { expiresIn: '1h' });
    const refreshToken = sign(payload, appConfig.jwt.refreshSecret, { expiresIn: '1w' });

    return { accessToken, refreshToken };
  }
}
