import { Controller, Post, Body, Get } from '@nestjs/common';
import { BetsService } from './bets.service';

@Controller('bets')
export class BetsController {
  constructor(private readonly betsService: BetsService) {}

  @Post('importar')
  async importar(@Body() body: { dia: string; pagina?: number; sport_id: string }) {
    const { dia, pagina, sport_id } = body;

    if (!sport_id) {
      return { sucesso: false, erro: 'sport_id é obrigatório' };
    }

    return this.betsService.importarEventos(sport_id, dia, pagina || 1);
  }
}

