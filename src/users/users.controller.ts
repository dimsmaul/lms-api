import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  UploadedFile,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationDto } from 'src/utils/dto/pagination.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('profilePicture', { storage: memoryStorage() }),
  )
  async create(
    @Body() createUserDto: CreateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.usersService.create(createUserDto, file);
  }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    return await this.usersService.findAll(paginationDto);
  }

  @Get(':username')
  async findOne(@Param('username') username: string) {
    return await this.usersService.findOne(username);
  }

  @Patch(':username')
  @UseInterceptors(
    FileInterceptor('profilePicture', { storage: memoryStorage() }),
  )
  async update(
    @Param('username') username: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return await this.usersService.update(username, updateUserDto, file);
  }

  @Delete(':username')
  async remove(@Param('username') username: string) {
    return await this.usersService.remove(username);
  }
}
