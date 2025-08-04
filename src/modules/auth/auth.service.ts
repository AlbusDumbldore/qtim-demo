import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../../database/entities/user.entity';
import { UserLoginRequestBodyDto, UserRegisterRequestBodyDto } from './dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async register(dto: UserRegisterRequestBodyDto) {
    const exists = await this.userRepository.findOne({ where: { email: dto.email } });
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
    return dto;
  }
}
