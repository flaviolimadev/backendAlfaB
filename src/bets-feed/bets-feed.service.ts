import { Injectable } from '@nestjs/common';
import { supabase } from '../supabase/supabase.service';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as timezone from 'dayjs/plugin/timezone';

dayjs.extend(utc);
dayjs.extend(timezone);

@Injectable()
export class BetsFeedService {
  async getUpcomingBets() {
    const agora = Math.floor(Date.now() / 1000);

    const { data: events, error } = await supabase
      .from('events')
      .select(`
        id,
        sport_id,
        time,
        league_name,
        home_name,
        away_name,
        r_id,
        odds_fetched
      `)
      .gt('time', agora)
      .order('time', { ascending: true })
      .limit(100);

    if (error) {
      console.error('Erro Supabase (UpcomingBets):', error);
      throw new Error('Erro ao buscar eventos: ' + error.message);
    }

    const resultados = events.map((event) => {
      return {
        sport: event.sport_id,
        quanto: dayjs.unix(event.time).utc().tz('America/Sao_Paulo').format('DD/MM/YYYY HH:mm'),
        pais: '-', // opcional
        liga: event.league_name,
        timeCasa: event.home_name,
        timeVisitante: event.away_name,
        OddCasa: null, // para ajustar depois
        OddsEmpate: null,
        OddVisitante: null,
        oddsCarregadas: event.odds_fetched ?? false,
        iddoevent: event.id,
      };
    });

    return resultados;
  }

  async getPaginatedEvents(
    sports_ids: string[],
    page: number,
    limit: number,
    only_destaq: boolean
  ) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase
      .from('events')
      .select(`
        id,
        sport_id,
        time,
        league_name,
        home_name,
        away_name,
        r_id,
        destaq,
        odds_fetched
      `)
      .in('sport_id', sports_ids)
      .gte('time', Math.floor(Date.now() / 1000))
      .order('time', { ascending: true })
      .range(from, to);

    if (only_destaq) {
      query = query.eq('destaq', true);
    }

    const { data: events, error } = await query;

    if (error) {
      console.error('Erro Supabase (PaginatedEvents):', error);
      throw new Error('Erro ao buscar eventos: ' + error.message);
    }

    const resultado = events.map((event) => {
      return {
        sport: event.sport_id,
        quanto: dayjs.unix(event.time).utc().tz('America/Sao_Paulo').format('DD/MM/YYYY HH:mm'),
        pais: '', // opcional
        liga: event.league_name,
        timeCasa: event.home_name,
        timeVisitante: event.away_name,
        OddCasa: null,
        OddsEmpate: null,
        OddVisitante: null,
        oddsCarregadas: event.odds_fetched ?? false,
        destaque: event.destaq ?? false,
        iddoevent: event.id,
      };
    });

    return resultado;
  }
}
