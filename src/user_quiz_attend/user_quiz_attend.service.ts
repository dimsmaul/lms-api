import { Injectable } from '@nestjs/common';
import { CreateUserQuizAttendDto } from './dto/create-user_quiz_attend.dto';
import { UpdateUserQuizAttendDto } from './dto/update-user_quiz_attend.dto';

@Injectable()
export class UserQuizAttendService {
  create(createUserQuizAttendDto: CreateUserQuizAttendDto) {
    return 'This action adds a new userQuizAttend';
  }

  findAll() {
    return `This action returns all userQuizAttend`;
  }

  findOne(id: number) {
    return `This action returns a #${id} userQuizAttend`;
  }

  update(id: number, updateUserQuizAttendDto: UpdateUserQuizAttendDto) {
    return `This action updates a #${id} userQuizAttend`;
  }

  remove(id: number) {
    return `This action removes a #${id} userQuizAttend`;
  }
}
