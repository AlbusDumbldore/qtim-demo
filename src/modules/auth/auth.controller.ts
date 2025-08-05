import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { UserProfileResponseBodyDto } from '../user/dto';
import { AuthService } from './auth.service';
import {
  RefreshTokenRequestBodyDto,
  UserLoginRequestBodyDto,
  UserLoginResponseBodyDto,
  UserRegisterRequestBodyDto,
} from './dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOkResponse({ type: UserProfileResponseBodyDto })
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  async register(@Body() dto: UserRegisterRequestBodyDto) {
    return this.authService.register(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Вход для зарегистрированного пользователя' })
  @ApiOkResponse({ type: UserLoginResponseBodyDto })
  async login(@Body() dto: UserLoginRequestBodyDto) {
    return this.authService.login(dto);
  }

  @ApiCreatedResponse({ type: UserLoginResponseBodyDto })
  @ApiOperation({ summary: 'Обновление токенов' })
  @Post('refresh')
  async refresh(@Body() { refreshToken }: RefreshTokenRequestBodyDto) {
    return this.authService.refresh(refreshToken);
  }
}
