import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ModulesService } from './modules.service';
import { CreateModuleDto } from './dto/create-module.dto';
import { UpdateModuleDto } from './dto/update-module.dto';

@Controller('modules')
export class ModulesController {
  constructor(private readonly modulesService: ModulesService) {}

  @Post(':id')
  async create(@Param('id') id: string, @Body() createModuleDto: CreateModuleDto) {
    return await this.modulesService.create(id, createModuleDto);
  }

  @Get()
  async findAll() {
    return await this.modulesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.modulesService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateModuleDto: UpdateModuleDto,
  ) {
    return await this.modulesService.update(+id, updateModuleDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.modulesService.remove(+id);
  }
}
