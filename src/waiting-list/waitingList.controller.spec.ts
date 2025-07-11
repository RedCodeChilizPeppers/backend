import { Test, TestingModule } from '@nestjs/testing';
import { WaitingListController } from './waitingList.controller';
import { WaitingListService } from './waitingList.service';

describe('WaitingListController', () => {
  let controller: WaitingListController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WaitingListController],
      providers: [WaitingListService],
    }).compile();

    controller = module.get<WaitingListController>(WaitingListController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
