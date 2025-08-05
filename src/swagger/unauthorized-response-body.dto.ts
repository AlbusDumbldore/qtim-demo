import { HttpStatus } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UnauthorizedResponseBodyDto {
  @ApiPropertyOptional({ example: 'You should authenticate' })
  public error?: string;

  @ApiProperty({ example: 'Unauthorized' })
  public message: string;

  @ApiProperty({ example: HttpStatus.UNAUTHORIZED })
  public statusCode: number;
}
