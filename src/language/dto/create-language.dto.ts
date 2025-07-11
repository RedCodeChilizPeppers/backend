import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class CreateLanguageDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsNotEmpty()
	codeLangue: string;

	@IsBoolean()
	activate = true;
}
