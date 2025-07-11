import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { User } from 'src/user/schemas/user.schema';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class Notification {
	@Prop()
	from: number; // TODO revoir pour la gestion de cas

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
	to: User;

	@Prop()
	title: string;

	@Prop()
	body: string;

	@Prop()
	read: boolean;

	@Prop()
	enabled: boolean;

	@Prop()
	link: string;

	@Prop()
	datePush: Date;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
