import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from '../../database/entities/article.entity';
import { User } from '../../database/entities/user.entity';
import { CreateArticleRequestBodyDto } from './dto';

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
}
