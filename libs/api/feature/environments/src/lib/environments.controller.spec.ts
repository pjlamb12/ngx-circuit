import { Test, TestingModule } from '@nestjs/testing';
import { EnvironmentsController } from './environments.controller';
import { EnvironmentsService } from './environments.service';

describe('EnvironmentsController', () => {
  let controller: EnvironmentsController;

  const mockEnvironmentsService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    createApiKey: jest.fn(),
    deleteApiKey: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EnvironmentsController],
      providers: [
        {
          provide: EnvironmentsService,
          useValue: mockEnvironmentsService,
        },
      ],
    }).compile();

    controller = module.get<EnvironmentsController>(EnvironmentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an environment', async () => {
    const dto = { name: 'Dev', key: 'dev', applicationId: '1' };
    mockEnvironmentsService.create.mockResolvedValue(dto);
    expect(await controller.create(dto)).toEqual(dto);
    expect(mockEnvironmentsService.create).toHaveBeenCalledWith(dto);
  });
});
