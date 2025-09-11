import { Module } from '@nestjs/common';
import { ModItemQuizService } from './mod_item_quiz.service';
import { ModItemQuizController } from './mod_item_quiz.controller';

@Module({
  controllers: [ModItemQuizController],
  providers: [ModItemQuizService],
})
export class ModItemQuizModule {}
