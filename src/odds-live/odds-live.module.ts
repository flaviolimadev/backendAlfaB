import { Module } from '@nestjs/common';
import { OddsLiveService } from './odds-live.service';
import { OddsLiveController } from './odds-live.controller';

@Module({
  providers: [OddsLiveService],
  controllers: [OddsLiveController]
})
export class OddsLiveModule {}
