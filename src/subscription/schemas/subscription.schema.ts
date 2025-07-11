import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type SubscriptionDocument = Subscription & Document;

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class Subscription {
	@Prop()
	name: string;

	@Prop()
	description: string;

	@Prop()
	enable: boolean;

	@Prop({ type: Object })
	price: StripePrice;

	@Prop()
	id: string;

	@Prop()
	type: string;

	@Prop()
	stripeId: string;

	@Prop({ type: Object })
	prices: StripePrices;

	@Prop({ type: Object })
	stripesId: StripeId;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);
