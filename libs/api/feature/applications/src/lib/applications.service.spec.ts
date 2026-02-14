import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApplicationsService } from './applications.service';
import { Application } from './application.entity';
import { NotFoundException } from '@nestjs/common';

const mockApplicationRepository = {
  find: jest.fn(),
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

describe('ApplicationsService', () => {
  let service: ApplicationsService;
  let repository: Repository<Application>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationsService,
        {
          provide: getRepositoryToken(Application),
          useValue: mockApplicationRepository,
        },
      ],
    }).compile();

    service = module.get<ApplicationsService>(ApplicationsService);
    repository = module.get<Repository<Application>>(
      getRepositoryToken(Application),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of applications', async () => {
      const apps = [{ id: '1', name: 'Test App' }];
      mockApplicationRepository.find.mockResolvedValue(apps);

      expect(await service.findAll()).toEqual(apps);
    });
  });

  describe('findOne', () => {
    it('should return an application if found', async () => {
      const app = { id: '1', name: 'Test App' };
      mockApplicationRepository.findOneBy.mockResolvedValue(app);

      expect(await service.findOne('1')).toEqual(app);
    });

    it('should throw NotFoundException if not found', async () => {
      mockApplicationRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and save an application', async () => {
      const createDto = { name: 'New App' };
      const savedApp = { id: '1', ...createDto };

      mockApplicationRepository.create.mockReturnValue(savedApp);
      mockApplicationRepository.save.mockResolvedValue(savedApp);

      expect(await service.create(createDto)).toEqual(savedApp);
      expect(mockApplicationRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockApplicationRepository.save).toHaveBeenCalledWith(savedApp);
    });
  });

  describe('update', () => {
    it('should update and save the application', async () => {
      const existingApp = { id: '1', name: 'Old Name' };
      const updateDto = { name: 'New Name' };
      const updatedApp = { ...existingApp, ...updateDto };

      mockApplicationRepository.findOneBy.mockResolvedValue(existingApp);
      mockApplicationRepository.save.mockResolvedValue(updatedApp);

      expect(await service.update('1', updateDto)).toEqual(updatedApp);
      expect(mockApplicationRepository.save).toHaveBeenCalledWith(
        expect.objectContaining(updateDto),
      );
    });

    it('should throw if application not found for update', async () => {
      mockApplicationRepository.findOneBy.mockResolvedValue(null);
      await expect(service.update('1', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete the application', async () => {
      mockApplicationRepository.delete.mockResolvedValue({ affected: 1 });
      await service.remove('1');
      expect(mockApplicationRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if application not found', async () => {
      mockApplicationRepository.delete.mockResolvedValue({ affected: 0 });
      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});
