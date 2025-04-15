import { Controller, Post, Body } from '@nestjs/common';
import { ReferralsService } from './referrals.service';

@Controller('referrals')
export class ReferralsController {
  constructor(private readonly referralsService: ReferralsService) {}

  @Post('arvore')
  async mostrarArvore(@Body() body: { user_id: string }) {
    return this.referralsService.buscarRedeMultinivel(body.user_id);
  }
}
