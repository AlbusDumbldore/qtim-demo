import { ApiProperty } from '@nestjs/swagger';

export class UserProfileResponseBodyDto {
  @ApiProperty({ example: 8 })
  id: number;

  @ApiProperty({ example: 'Sergey Sorokin' })
  name: string;

  @ApiProperty({ example: 'serega@domain.com' })
  email: string;

  @ApiProperty({ example: '2077-03-22T07:28:01.717Z' })
  updated: string;

  @ApiProperty({ example: '2077-03-22T07:28:01.717Z' })
  created: string;
}
