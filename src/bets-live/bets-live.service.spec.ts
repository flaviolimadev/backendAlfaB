import { Test, TestingModule } from '@nestjs/testing';
import { BetsLiveService } from './bets-live.service';

describe('BetsLiveService', () => {
  let service: BetsLiveService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BetsLiveService],
    }).compile();

    service = module.get<BetsLiveService>(BetsLiveService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
