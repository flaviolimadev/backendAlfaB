import { Test, TestingModule } from '@nestjs/testing';
import { PagamentoCheckerService } from './pagamento-checker.service';

describe('PagamentoCheckerService', () => {
  let service: PagamentoCheckerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PagamentoCheckerService],
    }).compile();

    service = module.get<PagamentoCheckerService>(PagamentoCheckerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
