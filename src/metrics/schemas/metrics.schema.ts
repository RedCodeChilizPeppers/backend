import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MetricDocument = Metric & Document;

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class Metric {
	@Prop()
	type: string;

	@Prop()
	os: string;

	@Prop()
	userId: string;// TODO voir la gestion

	@Prop()
	pageName: string;

	@Prop()
	dateAction: Date;

	@Prop()
	ipUser: string;
}

export const MetricSchema = SchemaFactory.createForClass(Metric);
