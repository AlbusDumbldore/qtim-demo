import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '../../cache/cache.module';
import { Article } from '../../database/entities/article.entity';
import { ArticleController } from './article.controller';
import { ArticleService } from './article.service';

@Module({
  imports: [CacheModule, TypeOrmModule.forFeature([Article])],
  controllers: [ArticleController],
  providers: [ArticleService],
})
export class ArticleModule {}
