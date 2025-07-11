import {
	IsNumber,
	IsNotEmpty,
} from 'class-validator';

export class CreateSnapshotBlockchainDto {
    
    @IsNumber()
	talentValue: number;
    
    @IsNumber()
	numberParticipants: string;
    
    @IsNumber()
	sellActually: string;
}