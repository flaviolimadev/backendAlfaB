import { Injectable } from '@nestjs/common';
import { supabase } from '../supabase/supabase.service';
import * as dayjs from 'dayjs';

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
        bets_odds(data)
      `)
      .gt('time', agora)
      .order('time', { ascending: true })
      .limit(100);

    if (error) {
      throw new Error('Erro ao buscar eventos: ' + error.message);
    }

    const resultados = events.map((event) => {
      const oddsData = event.bets_odds?.[0]?.data;
      const odds = oddsData?.main?.sp?.full_time_result?.odds || [];

      const oddCasa = odds.find((o) => o.name === '1')?.odds || null;
      const oddEmpate = odds.find((o) => o.name === 'Draw')?.odds || null;
      const oddVisitante = odds.find((o) => o.name === '2')?.odds || null;

      return {
        sport: event.sport_id,
        quanto: dayjs.unix(event.time).format('DD/MM/YYYY HH:mm:ss'),
        pais: '-', // opcional: pode vir de outra tabela/relacionamento
        liga: event.league_name,
        timeCasa: event.home_name,
        timeVisitante: event.away_name,
        OddCasa: oddCasa,
        OddsEmpate: oddEmpate,
        OddVisitante: oddVisitante,
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
      .select('*, bets_odds(*)')
      .in('sport_id', sports_ids)
      .gte('time', Math.floor(Date.now() / 1000))
      .order('time', { ascending: true })
      .range(from, to);

    if (only_destaq) {
      query = query.eq('destaq', true);
    }

    const { data: events, error } = await query;

    if (error) {
      throw new Error('Erro ao buscar eventos');
    }

    const resultado = events.map((event) => {
      const odds = event.bets_odds?.[0]?.data?.main?.sp?.full_time_result?.odds || [];

      const oddCasa = odds.find(o => o.name === '1')?.odds || null;
      const oddEmpate = odds.find(o => o.name === 'Draw')?.odds || null;
      const oddVisitante = odds.find(o => o.name === '2')?.odds || null;

      return {
        sport: event.sport_id,
        quanto: dayjs.unix(event.time).format('DD/MM/YYYY HH:mm'),
        pais: '', // preencher se quiser incluir coluna no banco
        liga: event.league_name,
        timeCasa: event.home_name,
        timeVisitante: event.away_name,
        OddCasa: oddCasa,
        OddsEmpate: oddEmpate,
        OddVisitante: oddVisitante,
        iddoevent: event.id
      };
    });

    return resultado;
  }
}
