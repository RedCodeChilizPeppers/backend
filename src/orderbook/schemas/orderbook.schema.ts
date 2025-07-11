import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Talent } from 'src/talents/schemas/talent.schema';

export type OrderbookDocument = Orderbook & Document;

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class Orderbook {
	@Prop()
	userId: string;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Talent' })
	talent: Talent;

	@Prop()
	method: string;

	@Prop()
	price: number;

	@Prop()
	numberToken: number;

	@Prop()
	currency: string;

	@Prop({ default: 'pending' })
	status: string;

	@Prop()
	txLocked: boolean;

	@Prop()
	transactionId: string;
}

export const OrderbookSchema = SchemaFactory.createForClass(Orderbook);
