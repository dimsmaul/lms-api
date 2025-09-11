import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Query,
  UploadedFile,
  Headers,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { CourseListDto } from './dto/get-list.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import express from 'express';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('thumbnailUrl', { storage: memoryStorage() }),
  )
  async create(
    @Body() createCourseDto: CreateCourseDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: express.Request,
  ) {
    const token = req.cookies['access_token'];
    return await this.coursesService.create(createCourseDto, file, token);
  }

  @Get()
  @UseGuards(AuthGuard)
  async findAll(
    @Query() paginationDto: CourseListDto,
    @Req() req: express.Request,
  ) {
    const authorization = req.cookies['access_token'];
    return await this.coursesService.findAll(paginationDto, authorization);
  }

  @Get('admin')
  @UseGuards(AuthGuard)
  async findAllAdministrator(@Query() paginationDto: PaginationDto) {
    return await this.coursesService.findAllAdministrator(paginationDto);
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async findOne(@Param('id') id: string) {
    return await this.coursesService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('thumbnailUrl', { storage: memoryStorage() }),
  )
  async update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.coursesService.update(id, updateCourseDto, file);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Param('id') id: string) {
    return await this.coursesService.remove(id);
  }
}
