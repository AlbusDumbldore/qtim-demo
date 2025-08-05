import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import {
  BadRequestResponseBodyDto,
  ConflictResponseBodyDto,
  InternalServerErrorResponseBodyDto,
  UnauthorizedResponseBodyDto,
} from '../../swagger';
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
  @ApiBadRequestResponse({ type: BadRequestResponseBodyDto })
  @ApiConflictResponse({ type: ConflictResponseBodyDto })
  @ApiInternalServerErrorResponse({ type: InternalServerErrorResponseBodyDto })
  @ApiOperation({ summary: 'Регистрация нового пользователя' })
  async register(@Body() dto: UserRegisterRequestBodyDto) {
    return this.authService.register(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'Вход для зарегистрированного пользователя' })
  @ApiOkResponse({ type: UserLoginResponseBodyDto })
  @ApiBadRequestResponse({ type: BadRequestResponseBodyDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedResponseBodyDto })
  @ApiInternalServerErrorResponse({ type: InternalServerErrorResponseBodyDto })
  async login(@Body() dto: UserLoginRequestBodyDto) {
    return this.authService.login(dto);
  }

  @ApiCreatedResponse({ type: UserLoginResponseBodyDto })
  @ApiBadRequestResponse({ type: BadRequestResponseBodyDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedResponseBodyDto })
  @ApiInternalServerErrorResponse({ type: InternalServerErrorResponseBodyDto })
  @ApiOperation({ summary: 'Обновление токенов' })
  @Post('refresh')
  async refresh(@Body() { refreshToken }: RefreshTokenRequestBodyDto) {
    return this.authService.refresh(refreshToken);
  }
}
