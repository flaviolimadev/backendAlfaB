import { Test, TestingModule } from '@nestjs/testing';
import { BetsDetailsService } from './bets-details.service';

describe('BetsDetailsService', () => {
  let service: BetsDetailsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BetsDetailsService],
    }).compile();

    service = module.get<BetsDetailsService>(BetsDetailsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
