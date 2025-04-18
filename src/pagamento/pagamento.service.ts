import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import axios from 'axios';
import { supabase } from '../supabase/supabase.service';

@Injectable()
export class PagamentoService {
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

  // ✅ Verificador simples de CPF (11 dígitos numéricos)
  private validarCpf(cpf: string): boolean {
    return /^\d{11}$/.test(cpf);
  }

  async generateQRCode(userId: string, valor: number, cpf: string, metodo: string) {
    // ✅ Verifica o CPF antes de continuar
    if (!this.validarCpf(cpf)) {
      throw new BadRequestException('CPF inválido. Use apenas números, com 11 dígitos.');
    }

    // Buscar nome do usuário no Supabase
    const { data: user, error } = await supabase
      .from('profiles')
      .select('first_name')
      .eq('id', userId)
      .single();

    if (error || !user) {
      throw new NotFoundException('Usuário não encontrado no Supabase');
    }

    // Gerar token da PrimePag
    const token = await this.generateToken();

    // Chamada para gerar o QR Code Pix
    const response = await axios.post(
      'https://api.primepag.com.br/v1/pix/qrcodes',
      {
        value_cents: Math.round(valor),
        generator_name: user.first_name,
        generator_document: cpf,
        expiration_time: '1800',
        external_reference: 'TESTEAPI-PAYMENTS',
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const txid = response.data.qrcode.reference_code;

    // Inserir o registro na tabela deposits
    await supabase.from('deposits').insert({
      profile_id: userId,
      txid: txid,
      value: Math.round((valor)),
      type: 'PIX',
      status: '0',
      descricao: 'Gerado via API',
      bonus: 0,
    });

    // Retorno para o frontend
    return {
      qrcode: response.data.qrcode.image_base64,
      chave: response.data.qrcode.content,
      txid: txid,
      valor: valor,
    };
  }
}
