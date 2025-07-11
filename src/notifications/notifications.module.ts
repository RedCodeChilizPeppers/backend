import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';
import {
	Notification,
	NotificationSchema,
} from './schemas/notifications.schema';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Notification.name, schema: NotificationSchema },
		]),
	],
	exports: [NotificationsService], 
	controllers: [NotificationsController],
	providers: [NotificationsService],
})
export class NotificationsModule {}
