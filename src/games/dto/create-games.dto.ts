import { IsArray, IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateGameDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsNotEmpty()
	acronym: string;

	@IsArray()
	@IsNotEmpty()
	tag: string[];

	@IsBoolean()
	activate = true;
}
