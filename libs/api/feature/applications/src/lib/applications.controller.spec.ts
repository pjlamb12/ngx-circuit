import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';
import { AuthGuard } from '@nestjs/passport'; // Import AuthGuard

const mockApplicationsService = {
  create: jest.fn(),
  findAll: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
};

describe('ApplicationsController', () => {
  let controller: ApplicationsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApplicationsController],
      providers: [
        {
          provide: ApplicationsService,
          useValue: mockApplicationsService,
        },
      ],
    })
      .overrideGuard(AuthGuard('jwt')) // Mock the guard
      .useValue({ canActivate: jest.fn(() => true) })
      .compile();

    controller = module.get<ApplicationsController>(ApplicationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call create', () => {
    const dto = { name: 'Test' };
    controller.create(dto);
    expect(mockApplicationsService.create).toHaveBeenCalledWith(dto);
  });

  it('should call findAll', () => {
    controller.findAll();
    expect(mockApplicationsService.findAll).toHaveBeenCalled();
  });

  it('should call findOne', () => {
    controller.findOne('1');
    expect(mockApplicationsService.findOne).toHaveBeenCalledWith('1');
  });

  it('should call update', () => {
    const dto = { name: 'Updated' };
    controller.update('1', dto);
    expect(mockApplicationsService.update).toHaveBeenCalledWith('1', dto);
  });

  it('should call remove', () => {
    controller.remove('1');
    expect(mockApplicationsService.remove).toHaveBeenCalledWith('1');
  });
});
