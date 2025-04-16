import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import axios from 'axios';
import { supabase } from '../supabase/supabase.service';

@Injectable()
export class BetsLiveService {
  private readonly logger = new Logger(BetsLiveService.name);
  private readonly token = '92956-eZsGG6pLUF87yf';

  @Cron(CronExpression.EVERY_MINUTE)
  async fetchLiveEvents() {
    this.logger.log('🎯 Buscando eventos ao vivo...');

    const url = `https://api.b365api.com/v1/bet365/inplay_filter?sport_id=1&token=${this.token}`;

    try {
      const response = await axios.get(url);
      const results = response.data?.results || [];

      for (const event of results) {
        const {
          id,
          sport_id,
          time,
          time_status,
          league,
          home,
          away,
          ss,
          our_event_id,
          r_id,
          ev_id,
          updated_at,
        } = event;

        await supabase.from('events_live').upsert({
          id,
          sport_id,
          time,
          time_status,
          league_id: league.id,
          league_name: league.name,
          home_id: home.id,
          home_name: home.name,
          away_id: away.id,
          away_name: away.name,
          ss,
          our_event_id,
          r_id,
          ev_id,
          updated_at,
        });
      }

      this.logger.log(`✅ ${results.length} eventos ao vivo atualizados`);
    } catch (error) {
      this.logger.error('❌ Erro ao buscar eventos ao vivo:', error);
    }
  }
}
