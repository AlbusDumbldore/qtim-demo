import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from '../../database/entities/article.entity';
import { User } from '../../database/entities/user.entity';
import { CreateArticleRequestBodyDto, UpdateArticleRequestBodyDto } from './dto';

@Injectable()
export class ArticleService {
  constructor(
    @InjectRepository(Article)
    private articleRepository: Repository<Article>,
  ) {}

  async create(userId: User['id'], dto: CreateArticleRequestBodyDto) {
    return this.articleRepository.save({
      title: dto.title,
      description: dto.description,
      user: { id: userId },
    });
  }

  async update(userId: User['id'], articleId: Article['id'], dto: UpdateArticleRequestBodyDto) {
    const article = await this.getById(articleId);

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

    return this.getById(articleId);
  }

  async delete(userId: User['id'], articleId: Article['id']) {
    const article = await this.getById(articleId);

    if (article.user.id !== userId) {
      throw new ForbiddenException('You are not allowed to delete this article');
    }

    const { affected } = await this.articleRepository.delete({ id: articleId });

    return { success: Boolean(affected) };
  }

  public async getById(id: Article['id']) {
    const article = await this.articleRepository.findOne({ where: { id }, relations: ['user'] });

    if (!article) {
      throw new NotFoundException('Article does not exist');
    }

    return article;
  }
}
