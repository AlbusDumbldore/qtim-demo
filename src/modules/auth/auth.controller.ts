import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserLoginRequestBodyDto, UserLoginResponseBodyDto, UserRegisterRequestBodyDto } from './dto';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
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
}
