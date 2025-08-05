import { ApiProperty } from '@nestjs/swagger';

export class ArticleResponseBodyDto {
  @ApiProperty({ example: 1 })
  public id: number;

  @ApiProperty({ example: 'Собаки породы Корги стали жить, в среднем, 75 лет.' })
  public title: string;

  @ApiProperty({ example: 'Это необъяснимо, но факт! 😱' })
  public description: string;

  @ApiProperty({ example: '2025-08-05T10:30:00.000Z' })
  public created: Date;

  @ApiProperty({ example: '2025-08-05T10:30:00.000Z' })
  public updated: Date;
}
