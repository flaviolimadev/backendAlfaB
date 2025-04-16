import { Test, TestingModule } from '@nestjs/testing';
import { BetsFeedController } from './bets-feed.controller';

describe('BetsFeedController', () => {
  let controller: BetsFeedController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BetsFeedController],
    }).compile();

    controller = module.get<BetsFeedController>(BetsFeedController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
