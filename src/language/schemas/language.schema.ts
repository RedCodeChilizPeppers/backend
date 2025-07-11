import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LanguageDocument = Language & Document;

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class Language {
	@Prop()
	name: string;

	@Prop()
	codeLangue: string;

	@Prop()
	activate: boolean;
}

export const LanguageSchema = SchemaFactory.createForClass(Language);
