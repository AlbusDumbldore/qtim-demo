import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../database/entities/user.entity';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  const mockRepository = {
    findOne: jest.fn(),
    save: jest.fn(),
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findOneByEmail', () => {
    it('should find user by email', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOneByEmail('test@example.com');

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found by email', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const nonexistsEmail = 'nonexists@example.com';

      const result = await service.findOneByEmail(nonexistsEmail);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { email: nonexistsEmail } });
      expect(result).toBeNull();
    });

    it('should handle repository errors', async () => {
      const error = new Error('Database error');
      mockRepository.findOne.mockRejectedValue(error);

      await expect(service.findOneByEmail('test@example.com')).rejects.toThrow(error);
    });
  });

  describe('findOneById', () => {
    it('should find user by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOneById(mockUser.id);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: mockUser.id } });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found by id', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      const nonexistsId = 999;

      const result = await service.findOneById(nonexistsId);

      expect(mockRepository.findOne).toHaveBeenCalledWith({ where: { id: nonexistsId } });
      expect(result).toBeNull();
    });

    it('should handle repository errors', async () => {
      const error = new Error('Database error');
      mockRepository.findOne.mockRejectedValue(error);

      await expect(service.findOneById(1)).rejects.toThrow(error);
    });
  });

  describe('create', () => {
    const createUserData = {
      name: 'New User',
      email: 'new@example.com',
      password: 'password123',
    };

    it('should create a new user', async () => {
      const newUser = { ...mockUser, ...createUserData };
      mockRepository.save.mockResolvedValue(newUser);

      const result = await service.create(createUserData);

      expect(mockRepository.save).toHaveBeenCalledWith({
        name: createUserData.name,
        email: createUserData.email,
        password: createUserData.password,
      });
      expect(result).toEqual(newUser);
    });

    it('should handle repository errors during creation', async () => {
      const error = new Error('Database error');
      mockRepository.save.mockRejectedValue(error);

      await expect(service.create(createUserData)).rejects.toThrow(error);
    });

    it('should create user with partial data', async () => {
      const partialData = { name: 'Partial User' };
      const newUser = { ...mockUser, ...partialData };
      mockRepository.save.mockResolvedValue(newUser);

      const result = await service.create(partialData);

      expect(mockRepository.save).toHaveBeenCalledWith({
        name: partialData.name,
        email: undefined,
        password: undefined,
      });
      expect(result).toEqual(newUser);
    });
  });
});
