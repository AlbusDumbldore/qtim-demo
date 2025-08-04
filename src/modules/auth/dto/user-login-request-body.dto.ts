import { PickType } from '@nestjs/swagger';
import { UserRegisterRequestBodyDto } from './user-register-request-body.dto';

export class UserLoginRequestBodyDto extends PickType(UserRegisterRequestBodyDto, ['email', 'password']) {}
