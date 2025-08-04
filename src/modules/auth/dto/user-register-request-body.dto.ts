import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';

export class UserRegisterRequestBodyDto {
  @IsString()
  @MinLength(3)
  @ApiProperty({ example: 'Sergey Sorokin' })
  public name: string;

  @IsEmail()
  @ApiProperty({ example: 'sergey@domain.com' })
  public email: string;

  @IsString()
  @MinLength(6)
  @ApiProperty({
    example: 'MyPassword',
    description: 'Пароль должен быть не менее 6 символов',
  })
  public password: string;
}
