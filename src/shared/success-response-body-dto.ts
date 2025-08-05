import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseBodyDto {
  @ApiProperty({ example: true })
  success: boolean;
}
