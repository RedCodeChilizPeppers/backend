import { PartialType } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { CreateTransactionDto } from './create-transaction.dto';

export class UpdateTransactionDto extends PartialType(CreateTransactionDto) {
	@IsString({ each: true })
	@IsOptional()
	from?: string[];

	@IsString()
	@IsNotEmpty()
	transacId: string;

	@IsString()
	@IsOptional()
	os: string;

	@IsString()
	@IsOptional()
	product: string;

	@IsOptional()
	@IsBoolean()
	renew: boolean;

	@IsBoolean()
	@IsOptional()
	autoRenew: boolean;

	@IsString()
	@IsOptional()
	receipt: string;

	@IsString()
	@IsNotEmpty()
	status: string;
}
