import { ForbiddenException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { CacheTime } from '../../cache/cache.constants';
import { cacheArticleById, cacheArticlesList, cacheArticlesListQuery } from '../../cache/cache.keys';
import { CacheService } from '../../cache/cache.service';
import { Article } from '../../database/entities/article.entity';
import { User } from '../../database/entities/user.entity';
import { SuccessResponseBodyDto } from '../../shared';
import { CreateArticleRequestBodyDto, FindAllArticleRequestQueryDto, UpdateArticleRequestBodyDto } from './dto';

@Injectable()
export class ArticleService {
  private readonly logger = new Logger(ArticleService.name);

  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,

    private readonly cacheService: CacheService,
  ) {}

  async findAll(dto: FindAllArticleRequestQueryDto) {
    const cached = await this.cacheService.get(cacheArticlesListQuery(dto));
    if (cached) {
      return cached;
    }

    const { offset, limit, userId, sortDirection, sortBy, search } = dto;

    const options: FindManyOptions<Article> = {
      take: limit,
      skip: offset,
      where: {
        ...(userId ? { user: { id: userId } } : {}),
        ...(search ? { title: ILike(`%${search}%`) } : {}),
      },
      order: {
        [sortBy]: sortDirection,
      },
    };

    const [items, total] = await this.articleRepository.findAndCount(options);

    const response = { total, limit, offset, items };

    await this.cacheService.set(cacheArticlesListQuery(dto), response, {
      expiration: { type: 'EX', value: CacheTime.min5 },
    });

    return response;
  }

  async create(userId: User['id'], dto: CreateArticleRequestBodyDto): Promise<Article> {
    const article = await this.articleRepository.save({
      title: dto.title,
      description: dto.description,
      user: { id: userId },
    });

    this.logger.log(`New article created (id=${article.id}, title="${article.title}")`);

    return article;
  }

  async update(userId: User['id'], articleId: Article['id'], dto: UpdateArticleRequestBodyDto): Promise<Article> {
    const article = await this.findById(articleId);

    if (article.user.id !== userId) {
      throw new ForbiddenException('You are not allowed to update this article');
    }

    await this.articleRepository.update(
      { id: article.id },
      {
        title: dto.title,
        description: dto.description,
      },
    );

    this.logger.log(`Article updated (id=${article.id})`);

    await Promise.all([
      this.cacheService.delete(cacheArticleById(articleId)),
      this.cacheService.deleteForPattern(cacheArticlesList('*')),
    ]);

    return this.findById(articleId);
  }

  async delete(userId: User['id'], articleId: Article['id']): Promise<SuccessResponseBodyDto> {
    const article = await this.findById(articleId);

    if (article.user.id !== userId) {
      throw new ForbiddenException('You are not allowed to delete this article');
    }

    const { affected } = await this.articleRepository.delete({ id: articleId });

    this.logger.log(`Article deleted (id=${article.id})`);

    await Promise.all([
      this.cacheService.delete(cacheArticleById(articleId)),
      this.cacheService.deleteForPattern(cacheArticlesList('*')),
    ]);

    return { success: Boolean(affected) };
  }

  public async findById(id: Article['id']): Promise<Article> {
    const cached = await this.cacheService.get<Article>(cacheArticleById(id));
    if (cached) {
      return cached;
    }

    const article = await this.articleRepository.findOne({ where: { id }, relations: ['user'] });

    if (!article) {
      throw new NotFoundException('Article does not exist');
    }

    await this.cacheService.set(cacheArticleById(id), article, {
      expiration: { type: 'EX', value: CacheTime.min5 },
    });

    return article;
  }
}
