import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { SortDirection } from '../../../shared';

export enum ArticlesSortByEnum {
  id = 'id',
  title = 'title',
  description = 'description',
  created = 'created',
  updated = 'updated',
}

export class FindAllArticleRequestQueryDto {
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @ApiPropertyOptional({ example: 1 })
  userId?: number;

  @IsString()
  @IsOptional()
  @ApiPropertyOptional({ example: 'корги' })
  search?: string;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @ApiPropertyOptional({ example: 10 })
  limit: number = 10;

  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  @ApiPropertyOptional({ example: 0 })
  offset: number = 0;

  @IsEnum(ArticlesSortByEnum)
  @IsOptional()
  @ApiPropertyOptional({ enum: ArticlesSortByEnum, example: ArticlesSortByEnum.created })
  sortBy: ArticlesSortByEnum = ArticlesSortByEnum.created;

  @IsEnum(SortDirection)
  @IsOptional()
  @ApiPropertyOptional({ enum: SortDirection, example: SortDirection.desc })
  sortDirection: SortDirection = SortDirection.desc;
}
