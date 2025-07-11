import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MailingAddressDocument = MailingAddress & Document;

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class MailingAddress {
	@Prop()
	addr: string;

	@Prop()
	zipcode: string;

	@Prop()
	city: string;

	@Prop()
	country: string;
}

export const MailingAddressSchema =
	SchemaFactory.createForClass(MailingAddress);
