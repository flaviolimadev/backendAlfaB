import { Injectable, Logger } from '@nestjs/common';
import { supabase } from '../supabase/supabase.service';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

@Injectable()
export class BetsDetailsService {
  private readonly logger = new Logger(BetsDetailsService.name);

  async getDetailsByEventId(event_id: string) {
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*')
      .eq('id', event_id)
      .single();

    if (eventError || !event) {
      this.logger.error('Evento não encontrado:', eventError);
      return { error: 'Evento não encontrado' };
    }

    const { data: oddsData, error: oddsError } = await supabase
      .from('bets_odds')
      .select('data')
      .eq('event_id', event_id)
      .single();

    if (oddsError || !oddsData) {
      this.logger.error('Odds não encontradas:', oddsError);
      return { error: 'Odds não encontradas' };
    }

    const categorias = oddsData.data?.main?.sp || {};

    return {
      evento: {
        id: event.id,
        esporte: event.sport_id,
        data: dayjs.unix(event.time).utc().tz('America/Sao_Paulo').format('DD/MM/YYYY HH:mm'),
        pais: event.country_name || '',
        liga: event.league_name,
        timeCasa: event.home_name,
        timeVisitante: event.away_name,
        score: event.score,
      },
      probabilidades: Object.entries(categorias).map(([chave, valor]: any) => ({
        categoria: valor.name || chave,
        odds: valor.odds || [],
      })),
    };
  }
}
