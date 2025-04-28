import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import { supabase } from '../supabase/supabase.service';

@Injectable()
export class BetsService {
  private readonly logger = new Logger(BetsService.name);

  async importarEventos(sportId: string, dia: string, pagina = 1): Promise<any> {
    const url = `https://api.b365api.com/v1/bet365/upcoming?sport_id=${sportId}&skip_esports=true&day=${dia}&token=219918-8GSZxj7YNA6XEi&page=${pagina}`;

    try {
      const response = await axios.get(url);
      const eventos = response.data?.results || [];

      let totalSalvos = 0;

      for (const evento of eventos) {
        const { data: existente } = await supabase
          .from('events')
          .select('id')
          .eq('id', evento.id)
          .maybeSingle();

        if (existente) {
          this.logger.log(`⏩ Evento ${evento.id} já existe. Pulando...`);
          continue;
        }

        const novoEvento = {
          id: evento.id,
          sport_id: evento.sport_id,
          time: evento.time,
          time_status: evento.time_status,
          league_id: evento.league.id,
          league_name: evento.league.name,
          home_id: evento.home.id,
          home_name: evento.home.name,
          away_id: evento.away.id,
          away_name: evento.away.name,
          score: evento.ss,
          our_event_id: evento.our_event_id,
          r_id: evento.r_id,
          updated_at: evento.updated_at,
          odds_updated_at: evento.odds_updated_at,
        };

        await supabase.from('events').insert(novoEvento);
        totalSalvos++;
      }

      this.logger.log(`✅ ${totalSalvos} eventos novos salvos na página ${pagina}`);
      return { sucesso: true, total_salvos: totalSalvos };
    } catch (err) {
      this.logger.error(`❌ Erro ao importar eventos: ${err.message}`);
      return { sucesso: false };
    }
  }
}
