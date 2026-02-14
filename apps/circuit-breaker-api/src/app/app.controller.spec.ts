import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthService } from '@circuit-breaker/api/feature/auth';

describe('AppController', () => {
  let appController: AppController;
  let authService: AuthService;

  const mockAuthService = {
    login: jest.fn(),
  };

  const mockAppService = {
    getData: jest.fn().mockReturnValue({ message: 'Hello API' }),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        { provide: AppService, useValue: mockAppService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
    authService = app.get<AuthService>(AuthService);
  });

  describe('getData', () => {
    it('should return "Hello API"', () => {
      expect(appController.getData()).toEqual({ message: 'Hello API' });
    });
  });

  describe('login', () => {
    it('should return access token', async () => {
      const req = { user: { username: 'test' } };
      const expectedResult = { access_token: 'token' };
      mockAuthService.login.mockResolvedValue(expectedResult);

      expect(await appController.login(req)).toEqual(expectedResult);
      expect(mockAuthService.login).toHaveBeenCalledWith(req.user);
    });
  });

  describe('getProfile', () => {
    it('should return user from request', () => {
      const req = { user: { username: 'test' } };
      expect(appController.getProfile(req)).toEqual(req.user);
    });
  });
});
