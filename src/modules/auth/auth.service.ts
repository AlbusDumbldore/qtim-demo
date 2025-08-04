import { Injectable } from '@nestjs/common';
import { UserLoginRequestBodyDto, UserRegisterRequestBodyDto } from './dto';

@Injectable()
export class AuthService {
  async register(dto: UserRegisterRequestBodyDto) {
    return { id: 1, ...dto };
  }

  async login(dto: UserLoginRequestBodyDto) {
    return dto;
  }
}
