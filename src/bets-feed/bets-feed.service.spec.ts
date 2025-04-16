import { Test, TestingModule } from '@nestjs/testing';
import { BetsFeedService } from './bets-feed.service';

describe('BetsFeedService', () => {
  let service: BetsFeedService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BetsFeedService],
    }).compile();

    service = module.get<BetsFeedService>(BetsFeedService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
