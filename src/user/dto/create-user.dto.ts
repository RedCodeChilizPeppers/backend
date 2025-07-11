import {
	IsEmail,
	IsEthereumAddress,
	IsNotEmpty,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator';
import { User } from '../schemas/user.schema';

export class CreateUserDto {
	@IsString()
	@IsOptional()
	nickname: string;

	@IsEmail()
	@IsNotEmpty()
	email?: string;

	@IsString()
	@IsNotEmpty()
	password?: string;

	@IsEthereumAddress()
	@IsOptional()
	publicEthAddress: string;

	@ValidateNested()
	@IsOptional()
	referral: User;

	@IsString()
	@IsOptional()
	currency: string;

	@IsString()
	@IsOptional()
	affiliateCode: string;

	@IsString()
	@IsOptional()
	language: string;

	@IsString()
	@IsOptional()
	activationToken: string;

	@IsString()
	@IsOptional()
	city: string;
}
