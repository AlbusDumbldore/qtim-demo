import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { User } from '../../database/entities/user.entity';
import { AuthorizedUser } from '../../decorators';
import { JwtGuard } from '../../guards/jwt.guard';
import { UserProfileResponseBodyDto } from './dto';

@ApiBearerAuth()
@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  @ApiOkResponse({ type: UserProfileResponseBodyDto })
  @ApiOperation({ summary: 'Получить пользователя из текущего Access токена' })
  @Get('/profile')
  async getProfile(@AuthorizedUser() user: User) {
    return user;
  }
}
