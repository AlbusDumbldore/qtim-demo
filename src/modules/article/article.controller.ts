import { Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from '../../database/entities/user.entity';
import { AuthorizedUser } from '../../decorators';
import { JwtGuard } from '../../guards/jwt.guard';
import { IdNumberDto, SuccessResponseBodyDto } from '../../shared';
import {
  BadRequestResponseBodyDto,
  InternalServerErrorResponseBodyDto,
  NotFoundResponseBodyDto,
  UnauthorizedResponseBodyDto,
} from '../../swagger';
import { ArticleService } from './article.service';
import {
  ArticleResponseBodyDto,
  CreateArticleRequestBodyDto,
  FindAllArticleRequestQueryDto,
  FindAllArticleResponseBodyDto,
  UpdateArticleRequestBodyDto,
} from './dto';

@ApiBearerAuth()
@Controller('article')
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @ApiOkResponse({ type: FindAllArticleResponseBodyDto })
  @ApiBadRequestResponse({ type: BadRequestResponseBodyDto })
  @ApiOperation({ summary: 'Получить список статей' })
  @Get('/')
  async list(@Query() dto: FindAllArticleRequestQueryDto) {
    return this.articleService.findAll(dto);
  }

  @ApiOkResponse({ type: ArticleResponseBodyDto })
  @ApiNotFoundResponse({ type: NotFoundResponseBodyDto })
  @ApiBadRequestResponse({ type: BadRequestResponseBodyDto })
  @ApiInternalServerErrorResponse({ type: InternalServerErrorResponseBodyDto })
  @ApiOperation({ summary: 'Получить статью по id' })
  @Get('/:id')
  async index(@Param() { id }: IdNumberDto) {
    return this.articleService.findById(id);
  }

  @UseGuards(JwtGuard)
  @ApiCreatedResponse({ type: ArticleResponseBodyDto })
  @ApiBadRequestResponse({ type: BadRequestResponseBodyDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedResponseBodyDto })
  @ApiInternalServerErrorResponse({ type: InternalServerErrorResponseBodyDto })
  @ApiOperation({ summary: 'Создать новую статью' })
  @Post()
  async create(@AuthorizedUser() user: User, @Body() dto: CreateArticleRequestBodyDto) {
    return this.articleService.create(user.id, dto);
  }

  @UseGuards(JwtGuard)
  @ApiOkResponse({ type: ArticleResponseBodyDto })
  @ApiNotFoundResponse({ type: NotFoundResponseBodyDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedResponseBodyDto })
  @ApiInternalServerErrorResponse({ type: InternalServerErrorResponseBodyDto })
  @ApiOperation({ summary: 'Обновить статью' })
  @Put('/:id')
  async update(@AuthorizedUser() user: User, @Param() { id }: IdNumberDto, @Body() dto: UpdateArticleRequestBodyDto) {
    return this.articleService.update(user.id, id, dto);
  }

  @UseGuards(JwtGuard)
  @ApiOkResponse({ type: SuccessResponseBodyDto })
  @ApiNotFoundResponse({ type: NotFoundResponseBodyDto })
  @ApiUnauthorizedResponse({ type: UnauthorizedResponseBodyDto })
  @ApiInternalServerErrorResponse({ type: InternalServerErrorResponseBodyDto })
  @ApiOperation({ summary: 'Удалить статью' })
  @Delete('/:id')
  async delete(@AuthorizedUser() user: User, @Param() { id }: IdNumberDto) {
    return this.articleService.delete(user.id, id);
  }
}
