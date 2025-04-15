import { Module } from '@nestjs/common';
import { PagamentoCheckerService } from './pagamento-checker.service';

@Module({
  providers: [PagamentoCheckerService]
})
export class PagamentoCheckerModule {}
