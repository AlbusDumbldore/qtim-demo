import { HttpStatus } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class BadRequestResponseBodyDto {
  @ApiPropertyOptional({ example: 'Bad Request' })
  public error?: string;

  @ApiProperty({
    isArray: true,
    type: String,
    example: ['description must be a string', 'description must be longer than or equal to 1 characters'],
  })
  public message: string[];

  @ApiProperty({ example: HttpStatus.BAD_REQUEST })
  public statusCode: number;
}
