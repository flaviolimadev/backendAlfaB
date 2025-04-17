import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { supabase } from '../supabase/supabase.service';
import axios from 'axios';

@Injectable()
export class OddsLiveService {
  private readonly logger = new Logger(OddsLiveService.name);
  private readonly token = '92956-eZsGG6pLUF87yf';

  //@Cron('*/1 * * * *') // Executa a cada 1 minuto
  async atualizarOddsAoVivo() {
    this.logger.log('🔄 Atualizando odds ao vivo...');

    const { data: eventos, error } = await supabase
      .from('events')
      .select('id')
      .gte('timestamp', new Date().toISOString());

    if (error) {
      this.logger.error('Erro ao buscar eventos:', error.message);
      return;
    }

    for (const evento of eventos) {
      try {
        const { data } = await axios.get(
          `https://api.b365api.com/v1/bet365/event?token=${this.token}&FI=${evento.id}`
        );

        const odds = data?.results?.[0] || [];

        for (const grupo of odds) {
          if (grupo.type === 'MA') {
            const categoria = grupo.NA;

            for (const item of grupo?.PA || []) {
              const label = item.NA;
              const oddValue = parseFloat(item.OD);

              const { error: insertError } = await supabase
                .from('odds_live')
                .upsert({
                    event_id: evento.id,
                    category: categoria,
                    label: label,
                    odd_value: oddValue,
                    updated_at: new Date().toISOString()
                }, {
                    onConflict: 'event_id,label' // ← Aqui corrigido
                });


              if (insertError) {
                this.logger.warn(`Erro ao salvar odd para evento ${evento.id}: ${insertError.message}`);
              }
            }
          }
        }
      } catch (err) {
        this.logger.error(`Erro na API do evento ${evento.id}: ${err.message}`);
      }
    }
  }
}
