import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserQuizAttendService } from './user_quiz_attend.service';
import { CreateUserQuizAttendDto } from './dto/create-user_quiz_attend.dto';
import { UpdateUserQuizAttendDto } from './dto/update-user_quiz_attend.dto';

@Controller('user-quiz-attend')
export class UserQuizAttendController {
  constructor(private readonly userQuizAttendService: UserQuizAttendService) {}

  @Post()
  create(@Body() createUserQuizAttendDto: CreateUserQuizAttendDto) {
    return this.userQuizAttendService.create(createUserQuizAttendDto);
  }

  @Get()
  findAll() {
    return this.userQuizAttendService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userQuizAttendService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserQuizAttendDto: UpdateUserQuizAttendDto) {
    return this.userQuizAttendService.update(+id, updateUserQuizAttendDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userQuizAttendService.remove(+id);
  }
}
