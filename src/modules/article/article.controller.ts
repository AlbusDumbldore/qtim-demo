import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiOperation } from '@nestjs/swagger';
import { User } from '../../database/entities/user.entity';
import { AuthorizedUser } from '../../decorators';
import { JwtGuard } from '../../guards/jwt.guard';
import { IdNumberDto, SuccessResponseBodyDto } from '../../shared';
import { ArticleService } from './article.service';
import { CreateArticleRequestBodyDto, FindAllArticleRequestQueryDto, UpdateArticleRequestBodyDto } from './dto';

@ApiBearerAuth()
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @ApiOperation({ summary: 'Получить список статей' })
  @Get('/')
  async list(@Query() dto: FindAllArticleRequestQueryDto) {
    return this.articleService.findAll(dto);
  }

  @ApiOperation({ summary: 'Получить статью по id' })
  @Get('/:id')
  async index(@Param() { id }: IdNumberDto) {
    return this.articleService.findById(id);
  }

  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Создать новую статью' })
  @Post()
  async create(@AuthorizedUser() user: User, @Body() dto: CreateArticleRequestBodyDto) {
    return this.articleService.create(user.id, dto);
  }

  @UseGuards(JwtGuard)
  @ApiOperation({ summary: 'Обновить статью' })
  @Put('/:id')
  async update(@AuthorizedUser() user: User, @Param() { id }: IdNumberDto, @Body() dto: UpdateArticleRequestBodyDto) {
    return this.articleService.update(user.id, id, dto);
  }

  @UseGuards(JwtGuard)
  @ApiOkResponse({ type: SuccessResponseBodyDto })
  @ApiOperation({ summary: 'Удалить статью' })
  @Delete('/:id')
  async delete(@AuthorizedUser() user: User, @Param() { id }: IdNumberDto) {
    return this.articleService.delete(user.id, id);
  }
}
