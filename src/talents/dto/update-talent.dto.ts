import { PartialType } from '@nestjs/swagger';
import { IsNumber, IsOptional, ValidateNested } from 'class-validator';
import { SnapshotBlockchain } from 'src/snapshot-blockchain/entities/snapshot-blockchain.entity';
import { CreateTalentDto } from './create-talent.dto';

export class UpdateTalentDto extends PartialType(CreateTalentDto) {

    @IsOptional()
	@IsNumber()
	price: number;
}
