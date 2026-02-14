import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '@circuit-breaker/api/data-access/user';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';

const mockUserService = {
  findOne: jest.fn(),
  create: jest.fn(),
};

const mockJwtService = {
  sign: jest.fn(),
};

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user without password if validation succeeds', async () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedpassword',
      };
      mockUserService.findOne.mockResolvedValue(user);
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(true));

      const result = await service.validateUser('test@example.com', 'password');
      expect(result).toEqual({ id: '1', email: 'test@example.com' });
    });

    it('should return null if validation fails', async () => {
      const user = {
        id: '1',
        email: 'test@example.com',
        password: 'hashedpassword',
      };
      mockUserService.findOne.mockResolvedValue(user);
      jest
        .spyOn(bcrypt, 'compare')
        .mockImplementation(() => Promise.resolve(false));

      const result = await service.validateUser(
        'test@example.com',
        'wrongpassword',
      );
      expect(result).toBeNull();
    });

    it('should return null if user not found', async () => {
      mockUserService.findOne.mockResolvedValue(null);
      const result = await service.validateUser(
        'notfound@example.com',
        'password',
      );
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token', async () => {
      const user = { id: '1', email: 'test@example.com' };
      mockJwtService.sign.mockReturnValue('assignment-token');

      const result = await service.login(user);
      expect(result).toEqual({ access_token: 'assignment-token' });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        username: 'test@example.com',
        sub: '1',
      });
    });
  });

  describe('register', () => {
    it('should hash password and create user', async () => {
      const registrationDto = {
        email: 'new@example.com',
        password: 'password',
      };
      const hashedPassword = 'hashedPassword';
      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementation(() => Promise.resolve(hashedPassword));
      mockUserService.create.mockResolvedValue({
        ...registrationDto,
        password: hashedPassword,
        id: '1',
      });

      const result = await service.register(registrationDto);
      expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
      expect(mockUserService.create).toHaveBeenCalledWith({
        ...registrationDto,
        password: hashedPassword,
      });
      expect(result).toEqual({
        ...registrationDto,
        password: hashedPassword,
        id: '1',
      });
    });
  });
});
