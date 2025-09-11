import { Module } from '@nestjs/common';
import { UserQuizAttendService } from './user_quiz_attend.service';
import { UserQuizAttendController } from './user_quiz_attend.controller';

@Module({
  controllers: [UserQuizAttendController],
  providers: [UserQuizAttendService],
})
export class UserQuizAttendModule {}
