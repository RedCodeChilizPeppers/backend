import { PartialType } from '@nestjs/mapped-types';
import {
	IsBoolean,
	IsEnum,
	IsEthereumAddress,
	IsNotEmpty,
	IsOptional,
	IsString,
	ValidateNested,
} from 'class-validator';
import mongoose from 'mongoose';
import { UpdateUserDto } from './update-user.dto';

export class PortfolioUserDto extends PartialType(UpdateUserDto) {
	@ValidateNested()
	@IsNotEmpty()
	portfolioTalent: {
		amount: number;
		talent: mongoose.Schema.Types.ObjectId;
	};
}
