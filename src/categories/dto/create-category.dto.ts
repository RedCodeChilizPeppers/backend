import { IsBoolean, IsString, IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsBoolean()
	activate = true;
}
