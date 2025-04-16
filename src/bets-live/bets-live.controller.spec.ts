import { Test, TestingModule } from '@nestjs/testing';
import { BetsLiveController } from './bets-live.controller';

describe('BetsLiveController', () => {
  let controller: BetsLiveController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BetsLiveController],
    }).compile();

    controller = module.get<BetsLiveController>(BetsLiveController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
