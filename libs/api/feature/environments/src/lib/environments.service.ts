import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Environment } from './environment.entity';
import { ApiKey } from './api-key.entity';
import { Application } from '@circuit-breaker/api/feature/applications';
import { randomBytes } from 'crypto';

@Injectable()
export class EnvironmentsService {
  constructor(
    @InjectRepository(Environment)
    private readonly environmentRepository: Repository<Environment>,
    @InjectRepository(ApiKey)
    private readonly apiKeyRepository: Repository<ApiKey>,
  ) {}

  async create(createEnvironmentDto: {
    name: string;
    key: string;
    applicationId: string;
  }): Promise<Environment> {
    const environment = this.environmentRepository.create({
      ...createEnvironmentDto,
      application: { id: createEnvironmentDto.applicationId } as Application,
    });
    return this.environmentRepository.save(environment);
  }

  async findAll(applicationId: string): Promise<Environment[]> {
    return this.environmentRepository.find({
      where: { application: { id: applicationId } },
      order: { name: 'ASC' },
      relations: ['apiKeys'],
    });
  }

  async findOne(id: string): Promise<Environment> {
    const environment = await this.environmentRepository.findOne({
      where: { id },
    });
    if (!environment) {
      throw new NotFoundException(`Environment with ID ${id} not found`);
    }
    return environment;
  }

  async update(
    id: string,
    updateEnvironmentDto: { name?: string; key?: string },
  ): Promise<Environment> {
    const environment = await this.findOne(id);
    this.environmentRepository.merge(environment, updateEnvironmentDto);
    return this.environmentRepository.save(environment);
  }

  async remove(id: string): Promise<void> {
    const environment = await this.findOne(id);
    await this.environmentRepository.remove(environment);
  }

  // API Key Management

  async createApiKey(environmentId: string, name: string): Promise<ApiKey> {
    const environment = await this.findOne(environmentId);
    const key = `ckt_${randomBytes(16).toString('hex')}`; // Simple generation for now

    const apiKey = this.apiKeyRepository.create({
      name,
      key,
      environment,
    });

    return this.apiKeyRepository.save(apiKey);
  }

  async deleteApiKey(id: string): Promise<void> {
    const apiKey = await this.apiKeyRepository.findOne({ where: { id } });
    if (!apiKey) {
      throw new NotFoundException(`API Key with ID ${id} not found`);
    }
    await this.apiKeyRepository.remove(apiKey);
  }

  async getApiKey(key: string): Promise<ApiKey | null> {
    return this.apiKeyRepository.findOne({
      where: { key },
      relations: ['environment', 'environment.application'],
    });
  }
}
