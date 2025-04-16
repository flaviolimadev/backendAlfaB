import { Test, TestingModule } from '@nestjs/testing';
import { OddsLiveService } from './odds-live.service';

describe('OddsLiveService', () => {
  let service: OddsLiveService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OddsLiveService],
    }).compile();

    service = module.get<OddsLiveService>(OddsLiveService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
