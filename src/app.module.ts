import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { ArticleModule } from './modules/article/article.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [DatabaseModule, UserModule, AuthModule, ArticleModule],
})
export class AppModule {}
