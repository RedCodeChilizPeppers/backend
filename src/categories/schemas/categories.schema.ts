import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CategoriesDocument = Categories & Document;

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class Categories {
	@Prop()
	name: string;

	@Prop()
	activate: boolean;
}

export const CategoriesSchema = SchemaFactory.createForClass(Categories);
