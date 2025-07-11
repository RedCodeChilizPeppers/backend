import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { UserStatusEnum } from 'src/enums/UserStatus.enum';
import { Language } from 'src/language/schemas/language.schema';

export type UserAdminDocument = UserAdmin & Document;

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class UserAdmin {
	@Prop()
	email: string;

	@Prop()
	password: string;

	@Prop()
	firstname: string;

	@Prop()
	surname: string;

	@Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Language' }] })
	language: Language;

	@Prop()
	publicEthAddress: string;

	@Prop()
	lastConnexion: Date;

	@Prop()
	status: UserStatusEnum;
}

export const UserAdminSchema = SchemaFactory.createForClass(UserAdmin);
