import { Article } from '../database/entities/article.entity';
import { FindAllArticleRequestQueryDto } from '../modules/article/dto';

export const cacheRefreshToken = (token: string) => `refresh:${token}`;

export const cacheArticleById = (id: Article['id']) => `article:${id}`;
export const cacheArticlesList = (pattern: string) => `articles:${pattern}`;
export const cacheArticlesListQuery = (query: FindAllArticleRequestQueryDto) => {
  const { limit, offset, sortBy, sortDirection, search, userId } = query;

  return cacheArticlesList(`${limit}-${offset}-${sortBy}-${sortDirection}-${search}-${userId}`);
};
