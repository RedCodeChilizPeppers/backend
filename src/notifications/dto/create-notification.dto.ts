import {
	IsNumber,
	ValidateNested,
	IsNotEmpty,
	IsString,
	IsBoolean,
} from 'class-validator';
import { User } from 'src/user/schemas/user.schema';

export class CreateNotificationDto {
	@IsNumber()
	from: number;

	@ValidateNested()
	@IsNotEmpty()
	to: User;

	@IsString()
	@IsNotEmpty()
	title: string;

	@IsString()
	@IsNotEmpty()
	body: string;

	@IsBoolean()
	read = false;

	@IsBoolean()
	enabled = true;

	@IsString()
	link: string;
}
