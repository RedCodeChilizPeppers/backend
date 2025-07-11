import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, ObjectId } from 'mongoose';
import { Game } from 'src/games/schemas/games.schema';
import { Language } from 'src/language/schemas/language.schema';
import { MailingAddress } from 'src/mailing-address/schemas/mailing-address.schema';
import { InvestingEnum } from '../enums/investing.enum';
import { LanguageEnum } from '../enums/language.enum';
import { SexEnum } from 'src/enums/sex.enum';
import { UserStatusEnum } from 'src/enums/UserStatus.enum';
import { BannedEnum } from 'src/enums/banned.enum';
import { TimeZoneEnum } from '../enums/timezone.enum';
import { CurrencyEnum } from '../enums/currency.enum';
import { Transform } from 'class-transformer';

export type UserDocument = User & Document;

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class User {
	@Transform(({ value }) => value.toString())
	_id: ObjectId;

	@Prop()
	email: string;

	@Prop()
	password: string;

	@Prop({ default: false })
	isConfirmed: boolean;

	@Prop({ default: false })
	isBanned: boolean;

	@Prop()
	firstname: string;

	@Prop()
	surname: string;

	@Prop()
	nickname: string;

	@Prop()
	newsletter: boolean;

	@Prop()
	sex: SexEnum;

	@Prop()
	investing: InvestingEnum;

	// @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Language' })
	// language: Language;

	@Prop()
	language: string;

	@Prop()
	timezone: TimeZoneEnum;

	@Prop()
	activationToken: string;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'MailingAddress' })
	mailingAddress: MailingAddress;

	@Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Game' }] })
	games: Game[];

	@Prop()
	affiliateCode: string;

	@Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
	referral: User;

	@Prop()
	publicEthAddress: string;

	@Prop()
	kycConfirmed: string;

	@Prop()
	kycFile: string;

	@Prop()
	apiToken: string;

	@Prop()
	premium: boolean;

	@Prop()
	dateStartPremium: Date;

	@Prop()
	dateEndPremium: Date;

	@Prop()
	warningBanned: BannedEnum;

	@Prop()
	lastConnexion: Date;

	@Prop()
	status: UserStatusEnum;

	@Prop()
	address: string;

	@Prop()
	postalCode: string;

	@Prop()
	city: string;

	@Prop()
	country: string;

	@Prop()
	forgetToken: string;

	@Prop({ type: Object })
	params: ParamsUser;

	@Prop({ default: 0 })
	balanceAvailable: number;

	@Prop({ default: '€' })
	currency: CurrencyEnum;

	@Prop(
		raw([
			{
				amount: { type: Number },
				talent: { type: mongoose.Schema.Types.ObjectId, ref: 'Talent' },
			},
		]),
	)
	portfolioTalent: Array<Record<number, any>>;
}

export const UserSchema = SchemaFactory.createForClass(User);
