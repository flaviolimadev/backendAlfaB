import { Module } from '@nestjs/common';
import { BetsFeedController } from './bets-feed.controller';
import { BetsFeedService } from './bets-feed.service';

@Module({
  controllers: [BetsFeedController],
  providers: [BetsFeedService]
})
export class BetsFeedModule {}
