import { Test, TestingModule } from '@nestjs/testing';
import { TokenPriceHistoryService } from './token-price-history.service';

describe('TokenPriceHistoryService', () => {
  let service: TokenPriceHistoryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TokenPriceHistoryService],
    }).compile();

    service = module.get<TokenPriceHistoryService>(TokenPriceHistoryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
