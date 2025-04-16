import { Controller, Get, Query, Post, Body} from '@nestjs/common';
import { BetsFeedService } from './bets-feed.service';

@Controller('bets-feed')
export class BetsFeedController {
  constructor(private readonly betsFeedService: BetsFeedService) {}

  @Get('upcoming')
  async getUpcomingBets() {
    return await this.betsFeedService.getUpcomingBets();
  }

  @Post('paginated')
  async getPaginated(@Body() body: {
    sports_ids: string[];
    page?: number;
    limit?: number;
    only_destaq?: boolean;
  }) {
    const { sports_ids, page = 1, limit = 100, only_destaq = false } = body;
    return this.betsFeedService.getPaginatedEvents(sports_ids, page, limit, only_destaq);
  }
}
