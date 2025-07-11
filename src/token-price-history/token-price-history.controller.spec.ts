import { Test, TestingModule } from '@nestjs/testing';
import { TokenPriceHistoryController } from './token-price-history.controller';
import { TokenPriceHistoryService } from './token-price-history.service';

describe('TokenPriceHistoryController', () => {
  let controller: TokenPriceHistoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TokenPriceHistoryController],
      providers: [TokenPriceHistoryService],
    }).compile();

    controller = module.get<TokenPriceHistoryController>(TokenPriceHistoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
