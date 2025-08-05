import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { FindManyOptions } from 'typeorm/find-options/FindManyOptions';
import { Article } from '../../database/entities/article.entity';
import { User } from '../../database/entities/user.entity';
import { SuccessResponseBodyDto } from '../../shared';
import { CreateArticleRequestBodyDto, FindAllArticleRequestQueryDto, UpdateArticleRequestBodyDto } from './dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  async findAll(dto: FindAllArticleRequestQueryDto) {
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

    return {
      total,
      limit,
      offset,
      items,
    };
  }

  async create(userId: User['id'], dto: CreateArticleRequestBodyDto): Promise<Article> {
    return this.articleRepository.save({
      title: dto.title,
      description: dto.description,
      user: { id: userId },
    });
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

    return this.findById(articleId);
  }

  async delete(userId: User['id'], articleId: Article['id']): Promise<SuccessResponseBodyDto> {
    const article = await this.findById(articleId);

    if (article.user.id !== userId) {
      throw new ForbiddenException('You are not allowed to delete this article');
    }

    const { affected } = await this.articleRepository.delete({ id: articleId });

    return { success: Boolean(affected) };
  }

  public async findById(id: Article['id']): Promise<Article> {
    const article = await this.articleRepository.findOne({ where: { id }, relations: ['user'] });

    if (!article) {
      throw new NotFoundException('Article does not exist');
    }

    return article;
  }
}
