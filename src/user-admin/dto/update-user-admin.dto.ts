import { Prop } from '@nestjs/mongoose';
import { PartialType } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsDate } from 'class-validator';
import { UserStatusEnum } from 'src/enums/UserStatus.enum';
import { Language } from 'src/language/schemas/language.schema';
import { CreateUserAdminDto } from './create-user-admin.dto';

export class UpdateUserAdminDto extends PartialType(CreateUserAdminDto) {
	@IsString()
	@IsNotEmpty()
	firstname: string;

	@IsString()
	@IsNotEmpty()
	surname: string;

	@IsString()
	@IsNotEmpty()
	language: Language;

	@IsString()
	@IsNotEmpty()
	publicEthAddress: string;

	@IsDate()
	@IsNotEmpty()
	lastConnexion: Date;

	@Prop()
	status: UserStatusEnum;
}
