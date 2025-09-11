import { HttpException, Injectable } from '@nestjs/common';
import { CreateModuleItemDto } from './dto/create-module_item.dto';
import { UpdateModuleItemDto } from './dto/update-module_item.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ModuleItem } from './entities/module_item.entity';
import { Repository } from 'typeorm';
import { OneResponse } from 'src/utils/response/one-response';
import { MinioService } from 'src/minio/minio.service';
import { Course } from 'src/courses/entities/course.entity';

@Injectable()
export class ModuleItemsService {
  constructor(
    @InjectRepository(ModuleItem)
    private readonly moduleItemRepository: Repository<ModuleItem>,

    @InjectRepository(Course)
    private readonly courseRepository: Repository<Course>,

    private readonly minioService: MinioService,
  ) {}

  async create(
    id: string,
    createModuleItemDto: CreateModuleItemDto,
    source: Express.Multer.File,
  ) {
    var upload: string | undefined;
    if (source) {
      upload = await this.minioService.handleUploadSimplified('module', source);
    }

    const newdt = {
      ...createModuleItemDto,
      type: Number(createModuleItemDto.type),
      order: Number(createModuleItemDto.order),
      module: { id },
      sourceUrl: upload,
    };
    const moduleItem = this.moduleItemRepository.create(newdt);
    const response = await this.moduleItemRepository.save(moduleItem);
    return OneResponse(response);
  }

  findAll() {
    return `This action returns all moduleItems`;
  }

  async findOne(id: string) {
    const data = await this.moduleItemRepository.findOne({
      where: { id },
      relations: ['module', 'module.course'],
      select: {
        id: true,
        title: true,
        content: true,
        sourceUrl: true,
        type: true,
        createdAt: true,
        updatedAt: true,
        module: {
          id: true,
          course: {
            id: true,
          },
        },
      },
    });

    const moduleList = await this.courseRepository.findOne({
      where: { id: data?.module.course.id },
      relations: ['modules', 'modules.items'],
      select: {
        id: true,
        modules: {
          id: true,
          title: true,
          content: true,
          order: true,
          items: {
            id: true,
            title: true,
            content: true,
            order: true,
            type: true,
          }
        },
      },
    });

    if (!data) return new HttpException('Data Not Found', 404);

    const response = await this.minioService.getOneImageSimplified(
      data,
      'sourceUrl',
    );

    const newresponse = {
      ...response,
      module: moduleList?.modules
    }
    return OneResponse(newresponse);
  }

  update(id: number, updateModuleItemDto: UpdateModuleItemDto) {
    return `This action updates a #${id} moduleItem`;
  }

  remove(id: number) {
    return `This action removes a #${id} moduleItem`;
  }
}
