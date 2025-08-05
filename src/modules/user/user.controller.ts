import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from '../../database/entities/user.entity';
import { AuthorizedUser } from '../../decorators';
import { JwtGuard } from '../../guards/jwt.guard';
import { InternalServerErrorResponseBodyDto, UnauthorizedResponseBodyDto } from '../../swagger';
import { UserProfileResponseBodyDto } from './dto';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  @ApiOkResponse({ type: UserProfileResponseBodyDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedResponseBodyDto })
  @ApiInternalServerErrorResponse({ type: InternalServerErrorResponseBodyDto })
  @ApiOperation({ summary: 'Получить пользователя из текущего Access токена' })
  @Get('/profile')
  async getProfile(@AuthorizedUser() user: User) {
    return user;
  }
}
