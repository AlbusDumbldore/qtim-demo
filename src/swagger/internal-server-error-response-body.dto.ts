import { HttpStatus } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class InternalServerErrorResponseBodyDto {
  @ApiPropertyOptional({ example: 'Something went wrong' })
  public error?: string;

  @ApiProperty({ example: 'Internal Server Error' })
  public message: string;

  @ApiProperty({ example: HttpStatus.INTERNAL_SERVER_ERROR })
  public statusCode: number;
}
