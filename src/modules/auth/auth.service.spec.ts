import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CacheService } from '../../cache/cache.service';
import { User } from '../../database/entities/user.entity';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';
import { UserRegisterRequestBodyDto } from './dto';

describe('AuthService', () => {
  let service: AuthService;

  const mockUserService = {
    findOneByEmail: jest.fn(),
    create: jest.fn(),
  };

  const mockCacheService = {
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn(),
    deleteForPattern: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: CacheService,
          useValue: mockCacheService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('register', () => {
    const registerDto: UserRegisterRequestBodyDto = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
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

    it('should successfully register a new user', async () => {
      mockUserService.findOneByEmail.mockResolvedValue(null);
      mockUserService.create.mockResolvedValue(mockUser);

      const result = await service.register(registerDto);

      expect(mockUserService.findOneByEmail).toHaveBeenCalledWith(registerDto.email);
      expect(mockUserService.create).toHaveBeenCalledWith({
        name: registerDto.name,
        email: registerDto.email,
        password: expect.any(String),
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw ConflictException if user already exists', async () => {
      mockUserService.findOneByEmail.mockResolvedValue(mockUser);

      await expect(service.register(registerDto)).rejects.toThrow(ConflictException);
      expect(mockUserService.findOneByEmail).toHaveBeenCalledWith(registerDto.email);
      expect(mockUserService.create).not.toHaveBeenCalled();
    });

    it('should hash password before saving', async () => {
      mockUserService.findOneByEmail.mockResolvedValue(null);
      mockUserService.create.mockResolvedValue(mockUser);

      await service.register(registerDto);

      expect(mockUserService.create).toHaveBeenCalledWith({
        name: registerDto.name,
        email: registerDto.email,
        password: expect.not.stringMatching(registerDto.password),
      });
    });

    it('should pass user data correctly to UserService', async () => {
      mockUserService.findOneByEmail.mockResolvedValue(null);
      mockUserService.create.mockResolvedValue(mockUser);

      await service.register(registerDto);

      expect(mockUserService.create).toHaveBeenCalledWith({
        name: registerDto.name,
        email: registerDto.email,
        password: expect.any(String),
      });
    });

    it('should handle errors from UserService.findOneByEmail', async () => {
      const error = new Error('Database error');
      mockUserService.findOneByEmail.mockRejectedValue(error);

      await expect(service.register(registerDto)).rejects.toThrow(error);
      expect(mockUserService.create).not.toHaveBeenCalled();
    });

    it('should handle errors from UserService.create', async () => {
      const error = new Error('Database error');
      mockUserService.findOneByEmail.mockResolvedValue(null);
      mockUserService.create.mockRejectedValue(error);

      await expect(service.register(registerDto)).rejects.toThrow(error);
    });
  });
});
