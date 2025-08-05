import { ApiProperty } from '@nestjs/swagger';
import { PaginationResponseBodyDto } from '../../../shared';
import { ArticleResponseBodyDto } from './article-response-body.dto';

export class FindAllArticleResponseBodyDto extends PaginationResponseBodyDto {
  @ApiProperty({ type: [ArticleResponseBodyDto] })
  public items: ArticleResponseBodyDto[];
}
