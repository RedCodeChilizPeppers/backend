import { Injectable, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import {
	Notification,
	NotificationDocument,
} from './schemas/notifications.schema';

@Injectable()
export class NotificationsService {
	constructor(
		@InjectModel(Notification.name)
		private notificationModel: Model<NotificationDocument>,
	) {}
	async create(createNotificationDto: CreateNotificationDto) {
		const createNotif = await this.notificationModel.create(
			createNotificationDto,
		);
		return createNotif;
	}

	findAll() {
		return this.notificationModel.find();
	}

	findAllByUser(id: string) {
		return this.notificationModel
			.find({ to: id })
			.sort({ createdAt: -1 })
			.exec();
	}

	findAllByUserMaxNumber(id: string) {
		return this.notificationModel.find({ to: id, read: false }).sort({ createdAt: -1 }).exec();
	}

	async readOneNotif(id: string) {
		const updateReadNotif = await this.notificationModel.findOneAndUpdate(
			{ _id: id },
			{ read: true },
		);
		return updateReadNotif;
	}
	
	async readAllNotif(id: string) {
		const updateReadNotif = await this.notificationModel
		.updateMany({ to: id },{ read: true })
		.exec();
		return updateReadNotif;
	}

	findOne(id: string) {
		return this.notificationModel.findOne({ _id: id }).exec();
	}

	async update(id: string, updateNotificationDto: UpdateNotificationDto) {
		const updateNotif = await this.notificationModel.findOneAndUpdate(
			{ _id: id },
			updateNotificationDto,
		);
		return updateNotif;
	}

	async remove(id: string) {
		const deletedNotif = await this.notificationModel
			.findByIdAndRemove({ _id: id })
			.exec();
		return deletedNotif;
	}
}
