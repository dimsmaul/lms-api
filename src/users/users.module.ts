import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { MinioService } from 'src/minio/minio.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AuthModule],
  controllers: [UsersController],
  providers: [UsersService, MinioService],
})
export class UsersModule {}
