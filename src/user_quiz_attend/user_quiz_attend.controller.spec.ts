import { Test, TestingModule } from '@nestjs/testing';
import { UserQuizAttendController } from './user_quiz_attend.controller';
import { UserQuizAttendService } from './user_quiz_attend.service';

describe('UserQuizAttendController', () => {
  let controller: UserQuizAttendController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserQuizAttendController],
      providers: [UserQuizAttendService],
    }).compile();

    controller = module.get<UserQuizAttendController>(UserQuizAttendController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
