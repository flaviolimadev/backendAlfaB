import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import axios from 'axios';
import { supabase } from '../supabase/supabase.service';

@Injectable()
export class PagamentoCheckerService {
  private readonly logger = new Logger(PagamentoCheckerService.name);

  async generateToken(): Promise<string> {
    const url = 'https://api.primepag.com.br/auth/generate_token';

    const headers = {
      Authorization:
        'ODUwOTIzNmYtNzAwNS00YjUzLWJkYzEtOTg4ZTMwZDdjZGQ3OjBiYTcxN2JlLTczMmEtNGE5NC04ZWUyLTBlYTE3NTFlOGYxOQ==',
      'Content-Type': 'application/json',
    };

    const response = await axios.post(url, { grant_type: 'client_credentials' }, { headers });
    return response.data.access_token;
  }

  @Cron('*/30 * * * * *') // A cada 30 segundos
  async verificarDepositos() {
    this.logger.log('⏳ Verificando depósitos pendentes...');

    const { data: depositos, error } = await supabase
      .from('deposits')
      .select('id, txid, created_at, profile_id, value')
      .eq('status', '0')
      .eq('type', 'PIX');

    if (error || !depositos) {
      this.logger.error('Erro ao buscar depósitos pendentes');
      return;
    }

    const token = await this.generateToken();

    for (const deposito of depositos) {
      try {
        const criadoEm = new Date(deposito.created_at);
        const agora = new Date();
        const diffHoras = (agora.getTime() - criadoEm.getTime()) / (1000 * 60 * 60);

        if (diffHoras > 24) {
          await supabase
            .from('deposits')
            .update({ status: '3' })
            .eq('id', deposito.id);
          this.logger.log(`❌ Depósito expirado: ${deposito.txid}`);
          continue;
        }

        const response = await axios.get(
          `https://api.primepag.com.br/v1/pix/qrcodes/${deposito.txid}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        const statusPix = response.data?.qrcode?.status;

        if (statusPix === 'paid') {
          await supabase
            .from('deposits')
            .update({ status: '1' })
            .eq('id', deposito.id);

          await supabase.from('transactions').insert({
            user_id: deposito.profile_id,
            type: 'deposit',
            amount: deposito.value,
            status: 'confirmed',
          });

          const { data: perfil, error: perfilError } = await supabase
            .from('profiles')
            .select('balance_invest')
            .eq('id', deposito.profile_id)
            .single();

          if (!perfilError && perfil) {
            const novoBalance = (perfil.balance_invest || 0) + deposito.value;

            await supabase
              .from('profiles')
              .update({ balance_invest: novoBalance })
              .eq('id', deposito.profile_id);

            this.logger.log(`💰 Saldo atualizado para o usuário ${deposito.profile_id}`);
          }

          this.logger.log(`✅ Pagamento confirmado e registrado em transactions: ${deposito.txid}`);
        }
      } catch (err) {
        this.logger.warn(`⚠️ Erro ao verificar txid ${deposito.txid}: ${err.message}`);
      }
    }
  }
}
