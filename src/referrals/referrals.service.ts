import { Injectable } from '@nestjs/common';
import { supabase } from '../supabase/supabase.service';

@Injectable()
export class ReferralsService {
  async buscarRedeMultinivel(userId: string) {
    const resumo: Record<string, number> = {
      nivel_1: 0,
      nivel_2: 0,
      nivel_3: 0,
      nivel_4: 0,
      nivel_5: 0,
    };

    // Função recursiva para montar árvore com contador de níveis
    const construirArvore = async (
      usuarioId: string,
      nivelAtual: number
    ): Promise<any[]> => {
      if (nivelAtual > 5) return [];

      // Buscar IDs dos indicados diretos
      const { data: indicadosRef, error } = await supabase
        .from('referral_tree')
        .select('user_id')
        .eq('referred_by', usuarioId);

      if (error || !indicadosRef || indicadosRef.length === 0) {
        return [];
      }

      const idsIndicados = indicadosRef.map((r) => r.user_id);

      // Buscar perfis
      const { data: perfis } = await supabase
        .from('profiles')
        .select('id, first_name, last_name, email, contact, created_at')
        .in('id', idsIndicados);

      if (!perfis) return [];

      // Atualiza contador de nível
      resumo[`nivel_${nivelAtual}`] += perfis.length;

      // Recursão para indicados de cada perfil
      const listaComSubniveis = await Promise.all(
        perfis.map(async (perfil) => ({
          usuario: perfil,
          indicados: await construirArvore(perfil.id, nivelAtual + 1),
        }))
      );

      return listaComSubniveis;
    };

    const arvore = await construirArvore(userId, 1);

    return {
      arvore,
      resumo: {
        ...resumo,
        total: Object.values(resumo).reduce((acc, val) => acc + val, 0),
      },
    };
  }
}
