import { Test, TestingModule } from '@nestjs/testing';
import { EnvironmentsService } from './environments.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Environment } from './environment.entity';
import { ApiKey } from './api-key.entity';

describe('EnvironmentsService', () => {
  let service: EnvironmentsService;

  const mockEnvironmentRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    merge: jest.fn(),
    remove: jest.fn(),
  };

  const mockApiKeyRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnvironmentsService,
        {
          provide: getRepositoryToken(Environment),
          useValue: mockEnvironmentRepository,
        },
        {
          provide: getRepositoryToken(ApiKey),
          useValue: mockApiKeyRepository,
        },
      ],
    }).compile();

    service = module.get<EnvironmentsService>(EnvironmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create and return an environment', async () => {
      const createDto = {
        name: 'Production',
        key: 'prod',
        applicationId: 'app-id',
      };
      const expectedEnvironment = { id: 'env-id', ...createDto };

      mockEnvironmentRepository.create.mockReturnValue(expectedEnvironment);
      mockEnvironmentRepository.save.mockResolvedValue(expectedEnvironment);

      const result = await service.create(createDto);
      expect(result).toEqual(expectedEnvironment);
      expect(mockEnvironmentRepository.create).toHaveBeenCalledWith({
        ...createDto,
        application: { id: createDto.applicationId },
      });
    });
  });

  // Add more tests as needed
});
