import { Module } from '@nestjs/common';
import { SnapshotBlockchainService } from './snapshot-blockchain.service';
import { SnapshotBlockchainController } from './snapshot-blockchain.controller';

@Module({
  controllers: [SnapshotBlockchainController],
  providers: [SnapshotBlockchainService]
})
export class SnapshotBlockchainModule {}
