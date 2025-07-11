import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import mongoose, { Document, ObjectId } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';

export type TransactionDocument = Transaction & Document;

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class Transaction {
	@Transform(({ value }) => value.toString())
	_id: ObjectId;

	@Prop()
	talentId: string;

	@Prop()
	from: string[];

	@Prop()
	to: string;

	@Prop()
	transacId: string;

	@Prop({ default: 'stripe' })
	os: string;

	@Prop()
	currency: string;

	@Prop()
	price: number;

	@Prop()
	fees: number;

	@Prop({ default: false })
	renew: boolean;

	@Prop({ default: false })
	autoRenew: boolean;

	@Prop({ default: '$LTT Purchase' })
	product: string;

	@Prop()
	quantity: number;

	@Prop({ default: '' })
	receipt: string;

	@Prop({ default: 'pending' })
	status: string;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
