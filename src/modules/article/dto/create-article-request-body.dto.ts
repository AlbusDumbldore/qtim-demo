import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class CreateArticleRequestBodyDto {
  @ApiProperty({ example: 'Собаки породы Корги стали жить, в среднем, 75 лет.' })
  @MinLength(1)
  @IsString()
  public title: string;

  @ApiProperty({ example: 'Это необъяснимо, но факт! 😱' })
  @MinLength(1)
  @IsString()
  public description: string;
}
