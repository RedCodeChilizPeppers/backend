import {
	IsString,
	IsNotEmpty,
	IsBoolean,
	ValidateNested,
} from 'class-validator';

export class CreateSubscriptionDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsNotEmpty()
	description: string;

	@IsBoolean()
	@IsNotEmpty()
	enable: boolean;

	@ValidateNested()
	@IsNotEmpty()
	price: StripePrice;

	@IsString()
	@IsNotEmpty()
	id: string;

	@IsString()
	@IsNotEmpty()
	type: string;

	@IsString()
	@IsNotEmpty()
	stripeId: string;

	@ValidateNested()
	@IsNotEmpty()
	prices: StripePrices;

	@ValidateNested()
	@IsNotEmpty()
	stripesId: StripeId;
}
