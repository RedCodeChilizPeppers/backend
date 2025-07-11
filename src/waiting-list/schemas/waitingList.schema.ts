import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Talent } from 'src/talents/schemas/talent.schema';

export type WaitingListDocument = WaitingList & Document;

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class WaitingList {
	@Prop()
	userId: string;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Talent' })
	talent: Talent;

}

export const WaitingListSchema = SchemaFactory.createForClass(WaitingList);
