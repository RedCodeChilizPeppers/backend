import { IsString, IsNotEmpty, IsArray, IsDate } from 'class-validator';

export class CreateMetricDto {
	@IsString()
	@IsNotEmpty()
	type: string;

	@IsString()
	@IsNotEmpty()
	os: string;

	@IsString()
	@IsNotEmpty()
	userId: string;

	@IsString()
	@IsNotEmpty()
	pageName: string;

	@IsString()
	@IsNotEmpty()
	ipUser: string;
}
