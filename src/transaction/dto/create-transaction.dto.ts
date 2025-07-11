import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateTransactionDto {
	@IsString()
	@IsNotEmpty()
	talentId: string;

	@IsString({ each: true })
	@IsOptional()
	from?: string[];

	@IsString()
	@IsNotEmpty()
	to: string;

	@IsString()
	@IsOptional()
	os: string;

	@IsString()
	@IsNotEmpty()
	currency: string;

	@IsNumber()
	@IsNotEmpty()
	fees: number;

	@IsNumber()
	@IsNotEmpty()
	price: number;

	@IsNumber()
	@IsNotEmpty()
	quantity: number;

	@IsString()
	@IsOptional()
	status: string;

	@IsString()
	@IsOptional()
	product: string;

	@IsString()
	@IsOptional()
	transacId: string;
	
}
