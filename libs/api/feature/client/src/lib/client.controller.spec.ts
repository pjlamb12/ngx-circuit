import { Test, TestingModule } from '@nestjs/testing';
import { ClientController } from './client.controller';
import { ClientService } from './client.service';
import { ApiKeyGuard } from './api-key.guard';

describe('ClientController', () => {
  let controller: ClientController;

  const mockClientService = {
    getConfig: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClientController],
      providers: [
        {
          provide: ClientService,
          useValue: mockClientService,
        },
      ],
    })
      .overrideGuard(ApiKeyGuard)
      .useValue({ canActivate: () => true })
      .compile();

    controller = module.get<ClientController>(ClientController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return config', async () => {
    const mockConfig = { featureA: true };
    const mockRequest = { apiKey: {} };

    mockClientService.getConfig.mockResolvedValue(mockConfig);

    const result = await controller.getConfig(mockRequest);
    expect(result).toEqual(mockConfig);
    expect(mockClientService.getConfig).toHaveBeenCalledWith({});
  });
});
