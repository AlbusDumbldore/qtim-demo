import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateArticleRequestBodyDto {
  @ApiPropertyOptional({ example: 'Собаки породы Корги стали жить, в среднем, 75 лет.' })
  @IsOptional()
  @MinLength(1)
  @IsString()
  public title: string;

  @ApiPropertyOptional({ example: 'Это необъяснимо, но факт! 😱' })
  @IsOptional()
  @MinLength(1)
  @IsString()
  public description: string;
}
