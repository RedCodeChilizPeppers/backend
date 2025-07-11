import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { CreateOrderbookDto } from './create-orderbook.dto';

export class UpdateOrderbookDto extends PartialType(CreateOrderbookDto) {
	@IsBoolean()
	@IsOptional()
	txLocked?: boolean;

	@IsString()
	@IsOptional()
	transactionId?: string;

	@IsString()
	@IsOptional()
	status?: string;

	@IsNumber()
	@IsOptional()
	numberToken?: number;
}
