import { Test, TestingModule } from '@nestjs/testing';
import { ModItemQuizService } from './mod_item_quiz.service';

describe('ModItemQuizService', () => {
  let service: ModItemQuizService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ModItemQuizService],
    }).compile();

    service = module.get<ModItemQuizService>(ModItemQuizService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
