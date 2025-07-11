import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GameDocument = Game & Document;

@Schema()
export class Game {
	@Prop()
	name: string;

	@Prop()
	acronym: string;

	@Prop()
	tag: string[];

	@Prop()
	activate: boolean;
}

export const GameSchema = SchemaFactory.createForClass(Game);
