import { Test, TestingModule } from '@nestjs/testing';
import { ModItemQuizController } from './mod_item_quiz.controller';
import { ModItemQuizService } from './mod_item_quiz.service';

describe('ModItemQuizController', () => {
  let controller: ModItemQuizController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModItemQuizController],
      providers: [ModItemQuizService],
    }).compile();

    controller = module.get<ModItemQuizController>(ModItemQuizController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
