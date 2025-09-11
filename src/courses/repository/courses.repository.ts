import { DataSource, EntityRepository, Repository } from 'typeorm';
import { Course } from '../entities/course.entity';
import { CourseListDto } from '../dto/get-list.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/utils/dto/pagination.dto';

@Injectable()
export class CoursesRepository extends Repository<Course> {
  constructor(private dataSource: DataSource) {
    super(Course, dataSource.createEntityManager());
  }

  // FindAll Courses
  async findAllCourses(
    paginationDto: CourseListDto,
    userId: string,
  ): Promise<[Course[], number]> {
    const page = parseInt(String(paginationDto.page ?? ''), 10) || 1;
    const limit = parseInt(String(paginationDto.limit ?? ''), 10) || 10;
    const skip = (page - 1) * limit;

    const query = this.createQueryBuilder('course')
      .leftJoinAndSelect('course.createdBy', 'createdBy')
      .addSelect(['participants.progress'])
      .select([
        'course.id',
        'course.title',
        'course.description',
        'course.thumbnailUrl',
        'course.passingScore',
        'course.isPublic',
        'course.isPublished',
        'course.publishedAt',
        'course.createdAt',
        'course.updatedAt',
        'createdBy.id',
        'createdBy.firstName',
        'createdBy.lastName',
        'createdBy.email',
        'createdBy.profilePicture',
      ])
      .orderBy(
        `course.${paginationDto.sortBy || 'id'}`,
        paginationDto.sortOrder?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC',
      )
      .where('course.deletedAt IS NULL')
      .skip(skip)
      .take(limit);

    if (paginationDto.search) {
      query.andWhere(
        '(course.title LIKE :search OR course.description LIKE :search)',
        { search: `%${paginationDto.search}%` },
      );
    }

    if (paginationDto.type === 'my-participant') {
      query
        .leftJoinAndSelect('course.participants', 'participants')
        .andWhere('participants.userId = :userId', { userId })
        .andWhere('course.isPublished = true');
    } else if (paginationDto.type === 'my-trainer') {
      query
        .leftJoinAndSelect('course.trainers', 'trainer')
        .andWhere('trainer.id = :userId', { userId })
        .orWhere('course.createdBy.id = :userId', { userId });
    } else {
      query
        .andWhere('course.isPublic = true')
        .andWhere('course.isPublished = true')
        .andWhere(
          `NOT EXISTS (
            SELECT 1 FROM course_participants cp
            WHERE cp."courseId" = course.id
            AND cp."userId" = :userId
          )`,
          { userId },
        )
        .andWhere(
          `NOT EXISTS (
            SELECT 1 FROM course_trainer ct
            WHERE ct."courseId" = course.id
            AND ct."trainerId" = :userId
          )`,
          { userId },
        )
        .andWhere('course.createdBy.id != :userId', { userId });
    }

    return query.getManyAndCount();
  }

  // FindOne Course
  async findOneCourse(id: string): Promise<Course | null> {
    const course = await this.createQueryBuilder('course')
      .leftJoinAndSelect('course.trainers', 'trainer')
      .leftJoinAndSelect('course.createdBy', 'createdBy')

      //  include participants data
      .leftJoinAndSelect('course.participants', 'participants')
      .leftJoinAndSelect('participants.user', 'user')

      //  included modules item
      .leftJoinAndSelect('course.modules', 'module')
      .leftJoinAndSelect('module.items', 'item')

      .where('course.id = :id', { id })
      .select([
        'course.id',
        'course.title',
        'course.description',
        'course.thumbnailUrl',
        'course.passingScore',
        'course.isPublic',
        'course.isPublished',
        'course.status',
        'createdBy.id',
        'createdBy.firstName',
        'createdBy.lastName',
        'createdBy.email',
        'createdBy.profilePicture',
        'course.publishedAt',
        'course.createdAt',
        'course.updatedAt',
        'trainer.id',
        'trainer.firstName',
        'trainer.lastName',
        'trainer.email',
        'trainer.profilePicture',

        // participants
        'participants.id',
        'participants.progress',
        'user.id',
        'user.firstName',
        'user.lastName',
        'user.email',
        'user.profilePicture',

        // modules
        'module.id',
        'module.title',
        'module.content',
        'module.order',

        // module items
        'item.id',
        'item.title',
        'item.content',
        'item.order',
        'item.type',
      ])
      .getOne();

    return course;
  }

  // FindAll Courses for Admin Api
  async findAllCoursesAdmin(paginationDto: PaginationDto) {
    const page = parseInt(String(paginationDto.page ?? ''), 10) || 1;
    const limit = parseInt(String(paginationDto.limit ?? ''), 10) || 10;
    const skip = (page - 1) * limit;

    const qb = this.createQueryBuilder('course')
      .leftJoinAndSelect('course.createdBy', 'createdBy')
      .leftJoin('course.trainers', 'trainers')
      .leftJoin('course.participants', 'participants')
      .leftJoin('course.modules', 'modules')
      .select([
        'course.id',
        'course.title',
        'course.description',
        'course.isPublic',
        'course.isPublished',
        'course.status',
        'course.createdAt',
        'createdBy.id',
        'createdBy.firstName',
        'createdBy.lastName',
        'createdBy.email',
        'createdBy.username',
        // only ids for lighter load
        'trainers.id',
        'participants.id',
        'modules.id',
      ])
      .skip(skip)
      .take(limit)
      .orderBy(
        `course.${paginationDto.sortBy || 'id'}`,
        paginationDto.sortOrder || 'ASC',
      );

    // search filter
    if (paginationDto.search) {
      qb.andWhere(
        `(course.title ILIKE :search 
         OR course.description ILIKE :search 
         OR trainers.firstName ILIKE :search 
         OR trainers.lastName ILIKE :search 
         OR trainers.email ILIKE :search 
         OR trainers.username ILIKE :search)`,
        { search: `%${paginationDto.search}%` },
      );
    }

    const [rawData, total] = await qb.getManyAndCount();
    return { rawData, total, limit, page };
  }
}
