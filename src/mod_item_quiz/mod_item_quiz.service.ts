import { Injectable } from '@nestjs/common';
import { CreateModItemQuizDto } from './dto/create-mod_item_quiz.dto';
import { UpdateModItemQuizDto } from './dto/update-mod_item_quiz.dto';

@Injectable()
export class ModItemQuizService {
  create(createModItemQuizDto: CreateModItemQuizDto) {
    return 'This action adds a new modItemQuiz';
  }

  findAll() {
    return `This action returns all modItemQuiz`;
  }

  findOne(id: number) {
    return `This action returns a #${id} modItemQuiz`;
  }

  update(id: number, updateModItemQuizDto: UpdateModItemQuizDto) {
    return `This action updates a #${id} modItemQuiz`;
  }

  remove(id: number) {
    return `This action removes a #${id} modItemQuiz`;
  }
}
