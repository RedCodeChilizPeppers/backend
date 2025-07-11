import { PartialType } from '@nestjs/mapped-types';
import {
	IsBoolean,
	IsEnum,
	IsEthereumAddress,
	IsNumber,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator';
import { Game } from 'src/games/schemas/games.schema';
import { Language } from 'src/language/schemas/language.schema';
import { MailingAddress } from 'src/mailing-address/schemas/mailing-address.schema';
import { CurrencyEnum } from '../enums/currency.enum';
import { InvestingEnum } from '../enums/investing.enum';
import { LanguageEnum } from '../enums/language.enum';
import { TimeZoneEnum } from '../enums/timezone.enum';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
	@IsBoolean()
	@IsOptional()
	isConfirmed?: boolean;

	@IsBoolean()
	@IsOptional()
	isBanned?: boolean;

	@IsString()
	@IsOptional()
	firstname?: string;

	@IsString()
	@IsOptional()
	surname?: string;

	@IsString()
	@IsOptional()
	nickname?: string;

	@IsEnum(TimeZoneEnum)
	@IsOptional()
	timezone?: TimeZoneEnum;

	@IsBoolean()
	@IsOptional()
	newsletter?: boolean;

	@IsEnum(InvestingEnum)
	@IsOptional()
	investing?: InvestingEnum;

	@IsString()
	@IsOptional()
	currency?: string;

	@IsEnum(LanguageEnum)
	@IsOptional()
	language?: string;

	@ValidateNested()
	@IsOptional()
	mailingAddress?: MailingAddress;

	@ValidateNested()
	@IsOptional()
	games?: Game[];

	@ValidateNested()
	@IsOptional()
	param?: ParamsUser;

	@IsString()
	@IsOptional()
	address?: string;

	@IsString()
	@IsOptional()
	postalCode?: string;

	@IsString()
	@IsOptional()
	city?: string;

	@IsString()
	@IsOptional()
	country?: string;

	@IsString()
	@IsOptional()
	forgetToken?: string;

	@IsString()
	@IsOptional()
	kycConfirmed?: string;

	@IsString()
	@IsOptional()
	kycFile?: string;

	@IsNumber()
	@IsOptional()
	balanceAvailable?: number;
}
