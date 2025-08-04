import { ApiProperty } from '@nestjs/swagger';

const jwtExample =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJtZXNzYWdlIjoi0J3RgyDQuCDQt9Cw0YfQtdC8INCy0Ysg0Y3RgtC-INC00LXQutC-0LTQuNGA0YPQtdGC0LU_In0.wKYi1OM0AoN4i3XM3WRWlkuZhzoTkRO7ZSo0Q_-JATQ';

export class UserLoginResponseBodyDto {
  @ApiProperty({
    example: jwtExample,
  })
  accessToken: string;
  @ApiProperty({
    example: jwtExample,
  })
  refreshToken: string;
}
