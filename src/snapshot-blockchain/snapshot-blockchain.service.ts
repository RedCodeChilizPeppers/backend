import { Injectable } from '@nestjs/common';
import { CreateSnapshotBlockchainDto } from './dto/create-snapshot-blockchain.dto';
import { UpdateSnapshotBlockchainDto } from './dto/update-snapshot-blockchain.dto';

@Injectable()
export class SnapshotBlockchainService {
  create(createSnapshotBlockchainDto: CreateSnapshotBlockchainDto) {
    return 'This action adds a new snapshotBlockchain';
  }

  findAll() {
    return `This action returns all snapshotBlockchain`;
  }

  findOne(id: number) {
    return `This action returns a #${id} snapshotBlockchain`;
  }

  update(id: number, updateSnapshotBlockchainDto: UpdateSnapshotBlockchainDto) {
    return `This action updates a #${id} snapshotBlockchain`;
  }

  remove(id: number) {
    return `This action removes a #${id} snapshotBlockchain`;
  }
}
