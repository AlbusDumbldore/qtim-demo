import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CacheTime } from '../../cache/cache.constants';
import { cacheArticleById, cacheArticlesList, cacheArticlesListQuery } from '../../cache/cache.keys';
import { CacheService } from '../../cache/cache.service';
import { Article } from '../../database/entities/article.entity';
import { User } from '../../database/entities/user.entity';
import { SortDirection } from '../../shared';
import { ArticleService } from './article.service';
import {
  ArticlesSortByEnum,
  CreateArticleRequestBodyDto,
  FindAllArticleRequestQueryDto,
  UpdateArticleRequestBodyDto,
} from './dto';

describe('ArticleService', () => {
  let service: ArticleService;

  const mockRepository = {
    findAndCount: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    findOne: jest.fn(),
  };

  const mockCacheService = {
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
    deleteForPattern: jest.fn(),
  };

  const mockUser: User = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedPassword',
    created: new Date(),
    updated: new Date(),
    articles: [],
  };

  const mockArticle: Article = {
    id: 1,
    title: 'Test Article',
    description: 'Test Description',
    created: new Date(),
    updated: new Date(),
    user: mockUser,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ArticleService,
        {
          provide: getRepositoryToken(Article),
          useValue: mockRepository,
        },
        {
          provide: CacheService,
          useValue: mockCacheService,
        },
      ],
    }).compile();

    service = module.get<ArticleService>(ArticleService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    const findAllDto: FindAllArticleRequestQueryDto = {
      offset: 0,
      limit: 10,
      sortBy: ArticlesSortByEnum.created,
      sortDirection: SortDirection.desc,
    };

    it('should return cached data if available', async () => {
      const cachedData = { items: [mockArticle], total: 1, limit: 10, offset: 0 };
      mockCacheService.get.mockResolvedValue(cachedData);

      const result = await service.findAll(findAllDto);

      expect(mockCacheService.get).toHaveBeenCalledWith(cacheArticlesListQuery(findAllDto));
      expect(result).toEqual(cachedData);
      expect(mockRepository.findAndCount).not.toHaveBeenCalled();
    });

    it('should fetch data from database and cache it when no cache', async () => {
      mockCacheService.get.mockResolvedValue(null);
      mockRepository.findAndCount.mockResolvedValue([[mockArticle], 1]);

      const result = await service.findAll(findAllDto);

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        take: findAllDto.limit,
        skip: findAllDto.offset,
        where: {},
        order: { created: findAllDto.sortDirection },
      });
      expect(mockCacheService.set).toHaveBeenCalledWith(
        cacheArticlesListQuery(findAllDto),
        { total: 1, limit: findAllDto.limit, offset: findAllDto.offset, items: [mockArticle] },
        { expiration: { type: 'EX', value: CacheTime.min5 } },
      );
      expect(result).toEqual({ total: 1, limit: findAllDto.limit, offset: findAllDto.offset, items: [mockArticle] });
    });

    it('should apply user filter when userId is provided', async () => {
      const dtoWithUserId = { ...findAllDto, userId: 1 };
      mockCacheService.get.mockResolvedValue(null);
      mockRepository.findAndCount.mockResolvedValue([[mockArticle], 1]);

      await service.findAll(dtoWithUserId);

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        take: findAllDto.limit,
        skip: findAllDto.offset,
        where: { user: { id: 1 } },
        order: { created: findAllDto.sortDirection },
      });
    });

    it('should apply search filter when search is provided', async () => {
      const dtoWithSearch = { ...findAllDto, search: 'test' };
      mockCacheService.get.mockResolvedValue(null);
      mockRepository.findAndCount.mockResolvedValue([[mockArticle], 1]);

      await service.findAll(dtoWithSearch);

      expect(mockRepository.findAndCount).toHaveBeenCalledWith({
        take: findAllDto.limit,
        skip: findAllDto.offset,
        where: { title: expect.any(Object) },
        order: { created: findAllDto.sortDirection },
      });
    });
  });

  describe('create', () => {
    const createDto: CreateArticleRequestBodyDto = {
      title: 'New Article',
      description: 'New Description',
    };

    it('should create a new article', async () => {
      const newArticle = { ...mockArticle, ...createDto };
      mockRepository.save.mockResolvedValue(newArticle);
      mockRepository.findOne.mockResolvedValue(newArticle);

      const result = await service.create(mockUser.id, createDto);

      expect(mockRepository.save).toHaveBeenCalledWith({
        title: createDto.title,
        description: createDto.description,
        user: { id: mockUser.id },
      });
      expect(result).toEqual(newArticle);
    });

    it('should handle repository errors during creation', async () => {
      const error = new Error('Database error');
      mockRepository.save.mockRejectedValue(error);

      await expect(service.create(mockUser.id, createDto)).rejects.toThrow(error);
    });
  });

  describe('update', () => {
    const updateDto: UpdateArticleRequestBodyDto = {
      title: 'Updated Article',
      description: 'Updated Description',
    };

    it('should update article when user is the owner', async () => {
      mockRepository.findOne.mockResolvedValue(mockArticle);
      mockRepository.update.mockResolvedValue({ affected: 1 });
      mockCacheService.get.mockResolvedValue(mockArticle);

      const result = await service.update(mockUser.id, mockArticle.id, updateDto);

      expect(mockRepository.update).toHaveBeenCalledWith(
        { id: mockArticle.id },
        { title: updateDto.title, description: updateDto.description },
      );
      expect(mockCacheService.delete).toHaveBeenCalledWith(cacheArticleById(mockArticle.id));
      expect(mockCacheService.deleteForPattern).toHaveBeenCalledWith(cacheArticlesList('*'));
      expect(result).toEqual(mockArticle);
    });

    it('should throw ForbiddenException when user is not the owner', async () => {
      mockRepository.findOne.mockResolvedValue(mockArticle);

      await expect(service.update(2, mockArticle.id, updateDto)).rejects.toThrow(ForbiddenException);
      expect(mockRepository.update).not.toHaveBeenCalled();
    });

    it('should handle repository errors during update', async () => {
      const error = new Error('Database error');
      mockCacheService.get.mockResolvedValue(null);
      mockRepository.findOne.mockRejectedValue(error);

      await expect(service.update(mockUser.id, mockArticle.id, updateDto)).rejects.toThrow(error);
    });
  });

  describe('delete', () => {
    it('should delete article when user is the owner', async () => {
      mockRepository.findOne.mockResolvedValue(mockArticle);
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.delete(mockUser.id, mockArticle.id);

      expect(mockRepository.delete).toHaveBeenCalledWith({ id: mockArticle.id });
      expect(mockCacheService.delete).toHaveBeenCalledWith(cacheArticleById(mockArticle.id));
      expect(mockCacheService.deleteForPattern).toHaveBeenCalledWith(cacheArticlesList('*'));
      expect(result).toEqual({ success: true });
    });

    it('should throw ForbiddenException when user is not the owner', async () => {
      mockRepository.findOne.mockResolvedValue(mockArticle);

      await expect(service.delete(2, mockArticle.id)).rejects.toThrow(ForbiddenException);
      expect(mockRepository.delete).not.toHaveBeenCalled();
    });

    it('should return success false when no rows affected', async () => {
      mockRepository.findOne.mockResolvedValue(mockArticle);
      mockRepository.delete.mockResolvedValue({ affected: 0 });

      const result = await service.delete(mockUser.id, mockArticle.id);

      expect(result).toEqual({ success: false });
    });

    it('should handle repository errors during deletion', async () => {
      const error = new Error('Database error');
      mockCacheService.get.mockResolvedValue(null);
      mockRepository.findOne.mockRejectedValue(error);

      await expect(service.delete(mockUser.id, mockArticle.id)).rejects.toThrow(error);
    });
  });

  describe('findById', () => {
    it('should return cached article if available', async () => {
      mockCacheService.get.mockResolvedValue(mockArticle);

      const result = await service.findById(mockArticle.id);

      expect(mockCacheService.get).toHaveBeenCalledWith(cacheArticleById(mockArticle.id));
      expect(result).toEqual(mockArticle);
      expect(mockRepository.findOne).not.toHaveBeenCalled();
    });

    it('should fetch article from database and cache it when no cache', async () => {
      mockCacheService.get.mockResolvedValue(null);
      mockRepository.findOne.mockResolvedValue(mockArticle);

      const result = await service.findById(mockArticle.id);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: mockArticle.id }, relations: ['user'] });
      expect(mockCacheService.set).toHaveBeenCalledWith(cacheArticleById(mockArticle.id), mockArticle, {
        expiration: { type: 'EX', value: CacheTime.min5 },
      });
      expect(result).toEqual(mockArticle);
    });

    it('should throw NotFoundException when article not found', async () => {
      mockCacheService.get.mockResolvedValue(null);
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findById(999)).rejects.toThrow(NotFoundException);
      expect(mockCacheService.set).not.toHaveBeenCalled();
    });

    it('should handle repository errors', async () => {
      const error = new Error('Database error');
      mockCacheService.get.mockResolvedValue(null);
      mockRepository.findOne.mockRejectedValue(error);

      await expect(service.findById(mockArticle.id)).rejects.toThrow(error);
    });
  });
});
