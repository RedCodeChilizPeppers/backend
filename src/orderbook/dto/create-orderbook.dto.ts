import { ValidateNested, IsNotEmpty } from 'class-validator';
import { Talent } from 'src/talents/schemas/talent.schema';

export class CreateOrderbookDto {
	userId: string;

	// @ValidateNested()
	@IsNotEmpty()
	talent: Talent;

	method: string;

	price: number;

	numberToken: number;

	currency: string;

	status: string;
}
