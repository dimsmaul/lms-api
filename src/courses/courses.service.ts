import { HttpException, Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from './entities/course.entity';
import { Like, Repository } from 'typeorm';
import { MinioService } from 'src/minio/minio.service';
import { User } from 'src/users/entities/user.entity';
import { ListResponse } from 'src/utils/response/list-response';
import { OneResponse } from 'src/utils/response/one-response';
import { JwtHandlerService } from 'src/jwt_handler/jwt_handler.service';
import { CourseListDto } from './dto/get-list.dto';
import { CoursesRepository } from './repository/courses.repository';
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { CourseParticipants } from './entities/course_participant.entity';

@Injectable()
export class CoursesService {
  constructor(
    private readonly courseRepository: CoursesRepository,

    @InjectRepository(CourseParticipants)
    private readonly courseParticipantRepository: Repository<CourseParticipants>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly minioService: MinioService,
    private readonly jwtHandlerService: JwtHandlerService,
  ) {}

  async create(
    createCourseDto: CreateCourseDto,
    file: Express.Multer.File,
    token: string,
  ) {
    const extractedUserId = this.jwtHandlerService.getUserIdFromToken(token);
    const users = await this.userRepository.findOne({
      where: { id: extractedUserId },
      select: {
        id: true,
        isAllowedToCreateCourse: true,
        isSuperAdmin: true,
      },
    });

    // User Create Validation
    if (!users) {
      throw new HttpException(`User not found`, 404);
    }

    if (!users.isAllowedToCreateCourse || !users.isSuperAdmin) {
      throw new HttpException(`User is not allowed to create a course`, 403);
    }

    // Logic to handle uploading the file to MinIO
    var files = '';
    var newbody = { ...createCourseDto };

    if (file) {
      files = await this.minioService.handleUploadSimplified('course', file);

      newbody = {
        ...createCourseDto,
        thumbnailUrl: files,
      };
    }
    const newCourse = this.courseRepository.create({
      ...newbody,
      status: users.isSuperAdmin ? 2 : 0,
      trainers: createCourseDto.trainerIds
        ? createCourseDto.trainerIds?.split(',').map((id) => ({ id }))
        : [],
      createdBy: { id: extractedUserId },
    });
    const course = await this.courseRepository.save(newCourse);

    const participants = createCourseDto.participantIds
      ? createCourseDto.participantIds?.split(',').map((id) => ({ id }))
      : [];

    if (participants.length > 0) {
      const newparticipant = this.courseParticipantRepository.create(
        participants.map((participant) => ({
          course,
          user: participant,
        })),
      );

      await this.courseParticipantRepository.save(newparticipant);
    }

    const response = await this.minioService.getOneImageSimplified(
      course,
      'thumbnailUrl',
    );

    return OneResponse(response);
  }

  async findAll(paginationDto: CourseListDto, authorization: string) {
    const userId = this.jwtHandlerService.getUserIdFromToken(authorization);
    const page = parseInt(String(paginationDto.page ?? ''), 10) || 1;
    const limit = parseInt(String(paginationDto.limit ?? ''), 10) || 10;

    const [rawData, total] = await this.courseRepository.findAllCourses(
      paginationDto,
      userId,
    );

    const data = rawData.map((course) => {
      const participant = course.participants?.[0] || null;
      return {
        ...course,
        participants: participant ? { progress: participant.progress } : null,
      };
    });

    const response = await this.minioService.getListImageSimplifiedMultiList(
      data,
      ['thumbnailUrl', 'createdBy.profilePicture'],
    );
    return ListResponse(response, {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / (limit || 10)),
    });
  }

  async findAllAdministrator(paginationDto: PaginationDto) {
    const { rawData, total, limit, page } =
      await this.courseRepository.findAllCoursesAdmin(paginationDto);

    // Logic For Counting lenght of trainer, participants and modules
    const dataWithCounts = rawData.map((course) => {
      const { trainers, participants, modules, ...rest } = course;
      return {
        ...rest,
        trainersCount: course.trainers?.length ?? 0,
        participantsCount: course.participants?.length ?? 0,
        modulesCount: course.modules?.length ?? 0,
      };
    });

    const response = await this.minioService.getListImageSimplifiedMultiList(
      dataWithCounts,
      ['thumbnailUrl', 'createdBy.profilePicture'],
    );

    return ListResponse(response, {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / (limit || 10)),
    });
  }

  // async findAllAdministrator(paginationDto: PaginationDto) {
  //   const page = parseInt(String(paginationDto.page ?? ''), 10) || 1;
  //   const limit = parseInt(String(paginationDto.limit ?? ''), 10) || 10;
  //   const skip = (page - 1) * limit;

  //   const [rawData, total] = await this.courseRepository.findAndCount({
  //     skip,
  //     take: limit,
  //     order: {
  //       [paginationDto.sortBy || 'id']: paginationDto.sortOrder || 'ASC',
  //     },
  //     select: {
  //       id: true,
  //       title: true,
  //       description: true,
  //       isPublic: true,
  //       isPublished: true,
  //       status: true,
  //       createdAt: true,
  //       createdBy: {
  //         id: true,
  //         firstName: true,
  //         lastName: true,
  //         email: true,
  //         username: true,
  //       },
  //       trainers: {
  //         id: true,
  //       },
  //       participants: {
  //         id: true,
  //       },
  //       modules: {
  //         id: true,
  //       },
  //     },
  //     relations: {
  //       trainers: true,
  //       createdBy: true,
  //       modules: true,
  //       participants: true,
  //     },
  //     where: paginationDto.search
  //       ? {
  //           title: Like(`%${paginationDto.search}%`),
  //           description: Like(`%${paginationDto.search}%`),
  //           trainers: {
  //             firstName: Like(`%${paginationDto.search}%`),
  //             lastName: Like(`%${paginationDto.search}%`),
  //             email: Like(`%${paginationDto.search}%`),
  //             username: Like(`%${paginationDto.search}%`),
  //           },
  //         }
  //       : {},
  //   });

  //   const response = await this.minioService.getListImageSimplifiedMultiList(
  //     rawData,
  //     ['thumbnailUrl', 'createdBy.profilePicture'],
  //   );
  //   return ListResponse(response, {
  //     total,
  //     page,
  //     limit,
  //     totalPages: Math.ceil(total / (limit || 10)),
  //   });
  // }

  async findOne(id: string) {
    const course = await this.courseRepository.findOneCourse(id);

    if (!course) {
      throw new HttpException(`Course not found`, 404);
    }

    const response = await this.minioService.getOneImageSimplifiedMultiList(
      course,
      // 'thumbnailUrl',
      [
        'thumbnailUrl',
        'createdBy.profilePicture',
        'trainers.profilePicture',
        'participants.user.profilePicture',
      ],
    );

    return OneResponse(response);
  }

  async update(
    id: string,
    updateCourseDto: UpdateCourseDto,
    file?: Express.Multer.File,
  ) {
    const course = await this.courseRepository.findOne({
      where: { id },
    });

    if (!course) {
      throw new HttpException(`Course not found`, 404);
    }

    Object.assign(course, updateCourseDto);

    if (file) {
      course.thumbnailUrl = await this.minioService.handleUploadSimplified(
        'course',
        file,
      );
    }

    await this.courseRepository.save(course);

    const response = await this.minioService.getOneImageSimplified(
      course,
      'thumbnailUrl',
    );

    return OneResponse(response);
  }

  async remove(id: string) {
    const course = await this.courseRepository.findOne({
      where: { id },
    });

    if (!course) {
      throw new HttpException(`Course not found`, 404);
    }

    course.deletedAt = new Date();
    await this.courseRepository.save(course);
    return {
      message: `Course has been deleted successfully`,
    };
  }
}
