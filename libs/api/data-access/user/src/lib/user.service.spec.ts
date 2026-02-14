import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { UserService } from './user.service';

const mockUserRepository = {
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

describe('UserService', () => {
  let service: UserService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      const user = new User();
      user.email = 'test@example.com';
      mockUserRepository.findOneBy.mockResolvedValue(user);

      expect(await service.findOne('test@example.com')).toEqual(user);
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({
        email: 'test@example.com',
      });
    });

    it('should return null if not found', async () => {
      mockUserRepository.findOneBy.mockResolvedValue(null);

      expect(await service.findOne('notfound@example.com')).toBeNull();
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({
        email: 'notfound@example.com',
      });
    });
  });

  describe('create', () => {
    it('should create and save a new user', async () => {
      const userData = { email: 'new@example.com', password: 'password' };
      const user = new User();
      Object.assign(user, userData);

      mockUserRepository.create.mockReturnValue(user);
      mockUserRepository.save.mockResolvedValue(user);

      expect(await service.create(userData)).toEqual(user);
      expect(mockUserRepository.create).toHaveBeenCalledWith(userData);
      expect(mockUserRepository.save).toHaveBeenCalledWith(user);
    });
  });

  describe('findById', () => {
    it('should return a user if found by ID', async () => {
      const user = new User();
      user.id = '123';
      mockUserRepository.findOneBy.mockResolvedValue(user);

      expect(await service.findById('123')).toEqual(user);
      expect(mockUserRepository.findOneBy).toHaveBeenCalledWith({ id: '123' });
    });
  });
});
