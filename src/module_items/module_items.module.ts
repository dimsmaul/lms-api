import { Module } from '@nestjs/common';
import { ModuleItemsService } from './module_items.service';
import { ModuleItemsController } from './module_items.controller';
import { MinioService } from 'src/minio/minio.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ModuleItem } from './entities/module_item.entity';
import { Course } from 'src/courses/entities/course.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ModuleItem, Course])],
  controllers: [ModuleItemsController],
  providers: [ModuleItemsService, MinioService],
})
export class ModuleItemsModule {}
