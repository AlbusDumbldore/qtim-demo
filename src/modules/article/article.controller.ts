import { Body, Controller, Delete, Get, Post, Put, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { User } from '../../database/entities/user.entity';
import { AuthorizedUser } from '../../decorators';
import { JwtGuard } from '../../guards/jwt.guard';
import { ArticleService } from './article.service';
import { CreateArticleRequestBodyDto } from './dto';

@ApiBearerAuth()
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @ApiOperation({ summary: 'Получить список статей' })
  @Get('/')
  async list() {}

  @ApiOperation({ summary: 'Получить статью по id' })
  @Get('/:id')
  async index() {}

  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Создать новую статью' })
  @Post()
  async create(@AuthorizedUser() user: User, @Body() dto: CreateArticleRequestBodyDto) {
    return this.articleService.create(user.id, dto);
  }

  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Обновить статью' })
  @Put('/:id')
  async update() {}

  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Удалить статью' })
  @Delete('/:id')
  async delete() {}
}
