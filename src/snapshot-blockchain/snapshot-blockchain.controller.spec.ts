import { Test, TestingModule } from '@nestjs/testing';
import { SnapshotBlockchainController } from './snapshot-blockchain.controller';
import { SnapshotBlockchainService } from './snapshot-blockchain.service';

describe('SnapshotBlockchainController', () => {
  let controller: SnapshotBlockchainController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SnapshotBlockchainController],
      providers: [SnapshotBlockchainService],
    }).compile();

    controller = module.get<SnapshotBlockchainController>(SnapshotBlockchainController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
