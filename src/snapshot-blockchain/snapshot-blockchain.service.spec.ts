import { Test, TestingModule } from '@nestjs/testing';
import { SnapshotBlockchainService } from './snapshot-blockchain.service';

describe('SnapshotBlockchainService', () => {
  let service: SnapshotBlockchainService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SnapshotBlockchainService],
    }).compile();

    service = module.get<SnapshotBlockchainService>(SnapshotBlockchainService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
