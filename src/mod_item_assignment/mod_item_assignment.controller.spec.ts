import { Test, TestingModule } from '@nestjs/testing';
import { ModItemAssignmentController } from './mod_item_assignment.controller';
import { ModItemAssignmentService } from './mod_item_assignment.service';

describe('ModItemAssignmentController', () => {
  let controller: ModItemAssignmentController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModItemAssignmentController],
      providers: [ModItemAssignmentService],
    }).compile();

    controller = module.get<ModItemAssignmentController>(ModItemAssignmentController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
