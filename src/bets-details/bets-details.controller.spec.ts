import { Test, TestingModule } from '@nestjs/testing';
import { BetsDetailsController } from './bets-details.controller';

describe('BetsDetailsController', () => {
  let controller: BetsDetailsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BetsDetailsController],
    }).compile();

    controller = module.get<BetsDetailsController>(BetsDetailsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
