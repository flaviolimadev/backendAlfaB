import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { supabase } from '../supabase/supabase.service';
import axios from 'axios';

@Injectable()
export class OddsService {
  private readonly logger = new Logger(OddsService.name);
  private readonly token = '92956-eZsGG6pLUF87yf';

  @Cron(CronExpression.EVERY_MINUTE)
  async syncOdds() {
    this.logger.log('🔁 Iniciando sincronização de odds...');

    const { data: events, error } = await supabase
      .from('events')
      .select('id, time')
      .is('odds_fetched', false);

    if (error) {
      this.logger.error('❌ Erro ao buscar eventos:', error);
      return;
    }

    const agora = Math.floor(Date.now() / 1000);

    for (const event of events) {
      if (parseInt(event.time) > agora) {
        const url = `https://api.b365api.com/v3/bet365/prematch?token=${this.token}&FI=${event.id}`;
        try {
          const response = await axios.get(url);
          if (response.data?.success && response.data.results.length > 0) {
            await supabase.from('bets_odds').upsert({
              event_id: event.id,
              data: response.data.results[0],
              updated_at: new Date().toISOString(),
            });
            await supabase.from('events').update({ odds_fetched: true }).eq('id', event.id);
            this.logger.log(`✅ Odds atualizadas para evento ${event.id}`);
          }
        } catch (err) {
          this.logger.warn(`⚠️ Erro ao buscar odds para evento ${event.id}`);
        }
      }
    }
  }
}