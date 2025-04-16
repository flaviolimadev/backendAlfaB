import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PagamentoModule } from './pagamento/pagamento.module';
import { PagamentoCheckerModule } from './pagamento-checker/pagamento-checker.module';
import { ReferralsModule } from './referrals/referrals.module';
import { ScheduleModule } from '@nestjs/schedule';
import { BetsModule } from './bets/bets.module';
import { OddsModule } from './odds/odds.module';
import { BetsFeedModule } from './bets-feed/bets-feed.module';
import { BetsDetailsModule } from './bets-details/bets-details.module';
import { BetsLiveModule } from './bets-live/bets-live.module';
import { OddsLiveModule } from './odds-live/odds-live.module';

@Module({
  imports: [PagamentoModule, PagamentoCheckerModule, ReferralsModule, ScheduleModule.forRoot(), BetsModule, OddsModule, BetsFeedModule, BetsDetailsModule, BetsLiveModule, OddsLiveModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
