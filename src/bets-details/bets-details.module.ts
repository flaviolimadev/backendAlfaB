import { Module } from '@nestjs/common';
import { BetsDetailsService } from './bets-details.service';
import { BetsDetailsController } from './bets-details.controller';

@Module({
  controllers: [BetsDetailsController],
  providers: [BetsDetailsService],
})
export class BetsDetailsModule {}
