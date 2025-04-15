import { Controller, Post, Body } from '@nestjs/common';
import { PagamentoService } from './pagamento.service';

@Controller('pagamento')
export class PagamentoController {
  constructor(private readonly pagamentoService: PagamentoService) {}

  @Post('gerar-pix')
  async gerarPix(
    @Body()
    body: {
      userId: string;
      valor: number;
      cpf: string;
      metodo: string;
    }
  ) {
    return this.pagamentoService.generateQRCode(
      body.userId,
      body.valor,
      body.cpf,
      body.metodo
    );
  }
}
