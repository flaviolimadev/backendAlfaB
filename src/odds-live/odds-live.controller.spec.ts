import { Test, TestingModule } from '@nestjs/testing';
import { OddsLiveController } from './odds-live.controller';

describe('OddsLiveController', () => {
  let controller: OddsLiveController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OddsLiveController],
    }).compile();

    controller = module.get<OddsLiveController>(OddsLiveController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
