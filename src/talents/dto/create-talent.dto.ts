import { Type } from 'class-transformer';
import {
	IsBoolean,
	IsDate,
	IsEmail,
	IsEthereumAddress,
	IsNotEmpty,
	IsNumber,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator';
import { Categories } from 'src/categories/schemas/categories.schema';
import { Game } from 'src/games/schemas/games.schema';
import { SnapshotBlockchain } from 'src/snapshot-blockchain/entities/snapshot-blockchain.entity';
import { SocialNetwork } from 'src/social-network/entities/social-network.entity';

export class CreateTalentDto {
	@IsString()
	@IsNotEmpty()
	nickname: string;

	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsNotEmpty()
	surname: string;

	@IsString()
	@IsNotEmpty()
	image: string;

	@IsDate()
	@Type(() => Date)
	@IsOptional()
	birthday: Date;

	@IsNumber()
	@IsNotEmpty()
	contractLength: number;

	@IsNumber()
	@IsNotEmpty()
	introductionValue: number;

	@IsDate()
	@Type(() => Date)
	@IsNotEmpty()
	dateIntroduction: Date;

	@IsDate()
	@Type(() => Date)
	@IsNotEmpty()
	privateSale: Date;

	@IsNumber()
	@IsNotEmpty()
	privateSaleMax: number;

	@IsDate()
	@Type(() => Date)
	@IsNotEmpty()
	publicSale: Date;

	@IsNumber()
	@IsNotEmpty()
	publicSaleMax: number;

	@IsNumber()
	@IsNotEmpty()
	totalSupply: number;

	@IsBoolean()
	isSalable: boolean;

	@IsBoolean()
	isBuy: boolean;

	@IsString()
	@IsNotEmpty()
	currency: string;

	@IsBoolean()
	@IsNotEmpty()
	dividends: boolean;

	@IsNumber()
	price: number;

	@IsNumber()
	@IsNotEmpty()
	amountDividend: number;

	@IsString()
	@IsOptional()
	description: string;

	@IsString()
	@IsOptional()
	country: string;

	@ValidateNested()
	@IsNotEmpty()
	game: Game;

	@ValidateNested()
	@IsNotEmpty()
	category: Categories;

	@ValidateNested()
	@IsOptional()
	snapshotBlockchain: [SnapshotBlockchain];

	@ValidateNested()
	@IsOptional()
	social: [SocialNetwork];
}
