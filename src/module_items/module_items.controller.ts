import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  HttpException,
} from '@nestjs/common';
import { ModuleItemsService } from './module_items.service';
import { CreateModuleItemDto } from './dto/create-module_item.dto';
import { UpdateModuleItemDto } from './dto/update-module_item.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { extname } from 'path';

@Controller('module-items')
export class ModuleItemsController {
  constructor(private readonly moduleItemsService: ModuleItemsService) {}

  @Post(':id')
  @UseInterceptors(FileInterceptor('source', { storage: memoryStorage() }))
  async create(
    @Param('id') id: string,
    @Body() createModuleItemDto: CreateModuleItemDto,
    @UploadedFile() source: Express.Multer.File,
  ) {
    const ext = extname(source.originalname);
    if (ext !== '.pdf' && ext !== '.mp4') {
      return new HttpException('Unsupported Media Type', 415);
    }
    return await this.moduleItemsService.create(
      id,
      createModuleItemDto,
      source,
    );
  }

  @Get()
  findAll() {
    return this.moduleItemsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.moduleItemsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateModuleItemDto: UpdateModuleItemDto,
  ) {
    return this.moduleItemsService.update(+id, updateModuleItemDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.moduleItemsService.remove(+id);
  }
}
