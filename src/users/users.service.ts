import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { MinioService } from 'src/minio/minio.service';
import { ResponseUserDto } from './dto/response-user.dto';
import { OneResponse } from 'src/utils/response/one-response';
import { ListResponse } from 'src/utils/response/list-response';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly minioService: MinioService,
  ) {}

  async create(createUserDto: CreateUserDto, file?: Express.Multer.File) {
    var newbody = { ...createUserDto };
    if (file) {
      const files = await this.minioService.handleUploadSimplified(
        'profile',
        file,
      );
      newbody = {
        ...createUserDto,
        profilePicture: files,
      };
    }
    const user = this.userRepository.create(newbody);
    const data = await this.userRepository.save(user);

    const { password, deletedAt, ...response } =
      await this.minioService.getOneImageSimplified(data, 'profilePicture');

    return OneResponse(response);
  }

  async findAll(paginationDto: PaginationDto) {
    const page = parseInt(String(paginationDto.page ?? ''), 10) || 1;
    const limit = parseInt(String(paginationDto.limit ?? ''), 10) || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await this.userRepository.findAndCount({
      skip,
      take: limit,
      order: {
        [paginationDto.sortBy || 'id']: paginationDto.sortOrder || 'ASC',
      },
      select: ResponseUserDto,
      where: paginationDto.search
        ? {
            firstName: Like(`%${paginationDto.search}%`),
            lastName: Like(`%${paginationDto.search}%`),
            email: Like(`%${paginationDto.search}%`),
            username: Like(`%${paginationDto.search}%`),
          }
        : {},
    });
    const response = await this.minioService.getListImageSimplified(
      data,
      'profilePicture',
    );

    return ListResponse(response, {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  }

  async findOne(username: string) {
    const data = await this.userRepository.findOne({
      where: { username },
      select: ResponseUserDto,
    });
    if (!data) {
      throw new HttpException('User not found', 404);
    }
    const response = await this.minioService.getOneImageSimplified(
      data,
      'profilePicture',
    );
    return OneResponse(response);
  }

  async update(
    username: string,
    body: UpdateUserDto,
    file: Express.Multer.File,
  ) {
    const data = await this.userRepository.findOne({
      where: { username },
    });

    if (!data) {
      throw new HttpException('User not found', 404);
    }

    var newbody = { ...body };
    var files = '';

    if (file) {
      if (data.profilePicture)
        await this.minioService.deleteFile(data.profilePicture);

      const files = await this.minioService.handleUploadSimplified(
        'profile',
        file,
      );
      newbody = {
        ...body,
        profilePicture: files,
      };
    }

    const updatedUser = this.userRepository.merge(data, newbody);
    const updatedData = await this.userRepository.save(updatedUser);

    const { password, deletedAt, ...response } =
      await this.minioService.getOneImageSimplified(
        updatedData,
        'profilePicture',
      );
    return OneResponse(response);
  }

  async remove(username: string) {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) {
      throw new HttpException('User not found', 404);
    }
    user.deletedAt = new Date();
    await this.userRepository.save(user);

    return { message: 'User deleted successfully', data: null };
  }
}
