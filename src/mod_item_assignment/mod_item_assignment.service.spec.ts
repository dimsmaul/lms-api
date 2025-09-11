import { Test, TestingModule } from '@nestjs/testing';
import { ModItemAssignmentService } from './mod_item_assignment.service';

describe('ModItemAssignmentService', () => {
  let service: ModItemAssignmentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ModItemAssignmentService],
    }).compile();

    service = module.get<ModItemAssignmentService>(ModItemAssignmentService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
