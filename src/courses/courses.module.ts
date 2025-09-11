import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { MinioService } from 'src/minio/minio.service';
import { Course } from './entities/course.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { JwtHandlerService } from 'src/jwt_handler/jwt_handler.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from 'src/auth/auth.module';
import { CoursesRepository } from './repository/courses.repository';
import { DataSource } from 'typeorm';
import { CourseParticipants } from './entities/course_participant.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Course,
      User,
      CourseParticipants,
      CoursesRepository,
    ]),
    AuthModule,
  ],
  controllers: [CoursesController],
  providers: [
    CoursesService,
    CoursesRepository,
    MinioService,
    JwtHandlerService,
  ],
  exports: [CoursesService],
})
export class CoursesModule {}
