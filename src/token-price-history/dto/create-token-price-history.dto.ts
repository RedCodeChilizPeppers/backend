import { Prop } from "@nestjs/mongoose";
import { IsString, IsNotEmpty, IsNumber } from "class-validator";
import { Talent } from "src/talents/schemas/talent.schema";

export class CreateTokenPriceHistoryDto {
	@IsString()
	@IsNotEmpty()
	talent: Talent;

	@IsNumber()
	@IsNotEmpty()
	price: number;

	@IsString()
	@IsNotEmpty()
	currency: string;
}
