import { HttpStatus } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ConflictResponseBodyDto {
  @ApiPropertyOptional({ example: 'This email already registered' })
  public error?: string;

  @ApiProperty({ example: 'Conflict' })
  public message: string;

  @ApiProperty({ example: HttpStatus.CONFLICT })
  public statusCode: number;
}
