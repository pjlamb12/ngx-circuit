import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Flag } from './flag.entity';

@Injectable()
export class FlagsService {
  constructor(
    @InjectRepository(Flag)
    private readonly flagRepository: Repository<Flag>,
  ) {}

  async findAll(applicationId: string): Promise<Flag[]> {
    return this.flagRepository.find({
      where: { applicationId },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Flag> {
    const flag = await this.flagRepository.findOneBy({ id });
    if (!flag) {
      throw new NotFoundException(`Flag with ID ${id} not found`);
    }
    return flag;
  }

  async create(createFlagDto: Partial<Flag>): Promise<Flag> {
    const flag = this.flagRepository.create(createFlagDto);
    return this.flagRepository.save(flag);
  }

  async update(id: string, updateFlagDto: Partial<Flag>): Promise<Flag> {
    const flag = await this.findOne(id);
    Object.assign(flag, updateFlagDto);
    return this.flagRepository.save(flag);
  }

  async remove(id: string): Promise<void> {
    const result = await this.flagRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Flag with ID ${id} not found`);
    }
  }
}
