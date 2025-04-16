import { Controller, Post } from '@nestjs/common';
import { OddsService } from './odds.service';

@Controller('odds')
export class OddsController {
  constructor(private readonly oddsService: OddsService) {}

  @Post('sync')
  async manualSync() {
    return this.oddsService.syncOdds();
  }
}