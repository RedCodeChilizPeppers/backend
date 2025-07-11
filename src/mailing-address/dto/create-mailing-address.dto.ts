import { IsString, IsNotEmpty, IsArray } from 'class-validator';

export class CreateMailingAddressDto {
	@IsString()
	@IsNotEmpty()
	addr: string;

	@IsString()
	@IsNotEmpty()
	zipcode: string;

	@IsArray()
	@IsNotEmpty()
	city: string;

	@IsArray()
	@IsNotEmpty()
	country: string;
}
