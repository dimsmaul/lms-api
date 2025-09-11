import { Test, TestingModule } from '@nestjs/testing';
import { UserQuizAttendService } from './user_quiz_attend.service';

describe('UserQuizAttendService', () => {
  let service: UserQuizAttendService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserQuizAttendService],
    }).compile();

    service = module.get<UserQuizAttendService>(UserQuizAttendService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
