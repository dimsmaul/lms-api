import { Test, TestingModule } from '@nestjs/testing';
import { JwtHandlerService } from './jwt_handler.service';

describe('JwtHandlerService', () => {
  let service: JwtHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JwtHandlerService],
    }).compile();

    service = module.get<JwtHandlerService>(JwtHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
