import { Module } from '@nestjs/common';
import { BetsLiveService } from './bets-live.service';
import { BetsLiveController } from './bets-live.controller';

@Module({
  providers: [BetsLiveService],
  controllers: [BetsLiveController]
})
export class BetsLiveModule {}
