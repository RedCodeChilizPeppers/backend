import { Prop } from '@nestjs/mongoose';
import { IsString, IsNotEmpty, IsDate } from 'class-validator';
import { UserStatusEnum } from 'src/enums/UserStatus.enum';
import { Language } from 'src/language/schemas/language.schema';

export class CreateUserAdminDto {
	@IsString()
	@IsNotEmpty()
	email: string;

	@IsString()
	@IsNotEmpty()
	password: string;
}
