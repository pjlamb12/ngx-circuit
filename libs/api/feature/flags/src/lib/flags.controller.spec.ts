import { Test, TestingModule } from '@nestjs/testing';
import { FlagsController } from './flags.controller';
import { FlagsService } from './flags.service';
import { AuthGuard } from '@nestjs/passport';

const mockFlagsService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('FlagsController', () => {
  let controller: FlagsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FlagsController],
      providers: [
        {
          provide: FlagsService,
          useValue: mockFlagsService,
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt'))
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<FlagsController>(FlagsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call create', () => {
    const dto = { key: 'test-flag' };
    controller.create(dto);
    expect(mockFlagsService.create).toHaveBeenCalledWith(dto);
  });

  it('should call findAll', () => {
    const appId = 'app-1';
    controller.findAll(appId);
    expect(mockFlagsService.findAll).toHaveBeenCalledWith(appId);
  });

  it('should call findOne', () => {
    controller.findOne('1');
    expect(mockFlagsService.findOne).toHaveBeenCalledWith('1');
  });

  it('should call update', () => {
    const dto = { key: 'updated-key' };
    controller.update('1', dto);
    expect(mockFlagsService.update).toHaveBeenCalledWith('1', dto);
  });

  it('should call remove', () => {
    controller.remove('1');
    expect(mockFlagsService.remove).toHaveBeenCalledWith('1');
  });
});
