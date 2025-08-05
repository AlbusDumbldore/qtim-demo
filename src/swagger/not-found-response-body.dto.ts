import { HttpStatus } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class NotFoundResponseBodyDto {
  @ApiPropertyOptional({ example: 'Item does not exist' })
  public error?: string;

  @ApiProperty({ example: 'Not Found' })
  public message: string;

  @ApiProperty({ example: HttpStatus.NOT_FOUND })
  public statusCode: number;
}
