import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PagamentoModule } from './pagamento/pagamento.module';
import { PagamentoCheckerModule } from './pagamento-checker/pagamento-checker.module';
import { ReferralsModule } from './referrals/referrals.module';

@Module({
  imports: [PagamentoModule, PagamentoCheckerModule, ReferralsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
