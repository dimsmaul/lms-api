import { Injectable } from '@nestjs/common';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';
import { InjectRepository } from '@nestjs/typeorm';
// import your Module entity instead of Node.js's built-in 'module'
import { Module } from './entities/module.entity';
import { Repository } from 'typeorm';
import { OneResponse } from 'src/utils/response/one-response';

@Injectable()
export class ModulesService {
  constructor(
    @InjectRepository(Module)
    private readonly moduleRepository: Repository<Module>,
  ) {}

  async create(id: string, createModuleDto: CreateModuleDto) {
    const newdt = {
      ...createModuleDto,
      course: { id },
    };
    const module = this.moduleRepository.create(newdt);
    const response = await this.moduleRepository.save(module);
    return OneResponse(response);
  }

  async findAll() {
    return `This action returns all modules`;
  }

  async findOne(id: number) {
    return `This action returns a #${id} module`;
  }

  async update(id: number, updateModuleDto: UpdateModuleDto) {
    return `This action updates a #${id} module`;
  }

  async remove(id: number) {
    return `This action removes a #${id} module`;
  }
}
