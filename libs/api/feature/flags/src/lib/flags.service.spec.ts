import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FlagsService } from './flags.service';
import { Flag } from './flag.entity';
import { NotFoundException } from '@nestjs/common';

const mockFlagRepository = {
  find: jest.fn(),
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

describe('FlagsService', () => {
  let service: FlagsService;
  let repository: Repository<Flag>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FlagsService,
        {
          provide: getRepositoryToken(Flag),
          useValue: mockFlagRepository,
        },
      ],
    }).compile();

    service = module.get<FlagsService>(FlagsService);
    repository = module.get<Repository<Flag>>(getRepositoryToken(Flag));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of flags for an application', async () => {
      const flags = [{ id: '1', key: 'test-flag', applicationId: 'app-1' }];
      mockFlagRepository.find.mockResolvedValue(flags);

      expect(await service.findAll('app-1')).toEqual(flags);
      expect(mockFlagRepository.find).toHaveBeenCalledWith({
        where: { applicationId: 'app-1' },
        order: { createdAt: 'DESC' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a flag if found', async () => {
      const flag = { id: '1', key: 'test-flag' };
      mockFlagRepository.findOneBy.mockResolvedValue(flag);

      expect(await service.findOne('1')).toEqual(flag);
    });

    it('should throw NotFoundException if not found', async () => {
      mockFlagRepository.findOneBy.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('create', () => {
    it('should create and save a flag', async () => {
      const createDto = { key: 'new-flag', applicationId: 'app-1' };
      const savedFlag = { id: '1', ...createDto };

      mockFlagRepository.create.mockReturnValue(savedFlag);
      mockFlagRepository.save.mockResolvedValue(savedFlag);

      expect(await service.create(createDto)).toEqual(savedFlag);
      expect(mockFlagRepository.create).toHaveBeenCalledWith(createDto);
      expect(mockFlagRepository.save).toHaveBeenCalledWith(savedFlag);
    });
  });

  describe('update', () => {
    it('should update and save the flag', async () => {
      const existingFlag = { id: '1', key: 'old-key' };
      const updateDto = { key: 'new-key' };
      const updatedFlag = { ...existingFlag, ...updateDto };

      mockFlagRepository.findOneBy.mockResolvedValue(existingFlag);
      mockFlagRepository.save.mockResolvedValue(updatedFlag);

      expect(await service.update('1', updateDto)).toEqual(updatedFlag);
      expect(mockFlagRepository.save).toHaveBeenCalledWith(
        expect.objectContaining(updateDto),
      );
    });

    it('should throw if flag not found for update', async () => {
      mockFlagRepository.findOneBy.mockResolvedValue(null);
      await expect(service.update('1', {})).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete the flag', async () => {
      mockFlagRepository.delete.mockResolvedValue({ affected: 1 });
      await service.remove('1');
      expect(mockFlagRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException if flag not found', async () => {
      mockFlagRepository.delete.mockResolvedValue({ affected: 0 });
      await expect(service.remove('1')).rejects.toThrow(NotFoundException);
    });
  });
});
