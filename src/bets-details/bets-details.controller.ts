import { Controller, Post, Body } from '@nestjs/common';
import { BetsDetailsService } from './bets-details.service';

@Controller('bets-details')
export class BetsDetailsController {
  constructor(private readonly betsDetailsService: BetsDetailsService) {}

  @Post()
  async getEventDetails(@Body('event_id') event_id: string) {
    return this.betsDetailsService.getDetailsByEventId(event_id);
  }
}
