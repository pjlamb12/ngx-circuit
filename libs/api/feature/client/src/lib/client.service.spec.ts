import { Test, TestingModule } from '@nestjs/testing';
import { ClientService } from './client.service';
import { FlagsService } from '@circuit-breaker/api/feature/flags';
import { ApiKey } from '@circuit-breaker/api/feature/environments';

describe('ClientService', () => {
  let service: ClientService;

  const mockFlagsService = {
    findAll: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ClientService,
        {
          provide: FlagsService,
          useValue: mockFlagsService,
        },
      ],
    }).compile();

    service = module.get<ClientService>(ClientService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getConfig', () => {
    it('should return circuit config for the application', async () => {
      const apiKey = {
        environment: {
          application: { id: 'app-id' },
        },
      } as unknown as ApiKey;

      const mockFlags = [
        { key: 'featureA', defaultValue: true, type: 'BOOLEAN' },
        { key: 'featureB', defaultValue: false, type: 'BOOLEAN' },
        {
          key: 'featureComplex',
          defaultValue: false,
          type: 'PERCENTAGE',
          controlValue: { type: 'PERCENTAGE', percentage: 50 },
        },
      ];

      mockFlagsService.findAll.mockResolvedValue(mockFlags);

      const result = await service.getConfig(apiKey);

      expect(result).toEqual({
        featureA: true,
        featureB: false,
        featureComplex: { type: 'PERCENTAGE', percentage: 50 },
      });
      expect(mockFlagsService.findAll).toHaveBeenCalledWith('app-id');
    });
  });
});
