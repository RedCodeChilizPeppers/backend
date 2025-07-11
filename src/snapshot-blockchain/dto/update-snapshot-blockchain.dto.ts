import { PartialType } from '@nestjs/swagger';
import { CreateSnapshotBlockchainDto } from './create-snapshot-blockchain.dto';

export class UpdateSnapshotBlockchainDto extends PartialType(CreateSnapshotBlockchainDto) {
    
}
