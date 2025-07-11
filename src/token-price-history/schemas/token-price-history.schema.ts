import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Talent } from 'src/talents/schemas/talent.schema';

export type TokenPriceHistoryDocument = TokenPriceHistory & Document;

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class TokenPriceHistory {
	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Talent' })
	talent: Talent;

	@Prop()
	price: number;

	@Prop()
	currency: string;
}

export const TokenPriceHistorySchema =
	SchemaFactory.createForClass(TokenPriceHistory);
