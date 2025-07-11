import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subscription } from 'rxjs';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { SubscriptionDocument } from './schemas/subscription.schema';
import fetch from 'node-fetch';

@Injectable()
export class SubscriptionService {
	constructor(
		@InjectModel(Subscription.name)
		private subscriptionModel: Model<SubscriptionDocument>,
	) {}
	async create(createSubscriptionDto: CreateSubscriptionDto) {
		const createSub = await this.subscriptionModel.create(
			createSubscriptionDto,
		);
		return createSub;
	}

	findAll() {
		return this.subscriptionModel.find();
	}

	findOne(id: string) {
		return this.subscriptionModel.findOne({ _id: id }).exec();
	}

	async update(id: string, updateSubscriptionDto: UpdateSubscriptionDto) {
		const updateSub = await this.subscriptionModel.findOneAndUpdate(
			{ _id: id },
			updateSubscriptionDto,
		);
		return updateSub;
	}

	async remove(id: string) {
		const deletedSub = await this.subscriptionModel
			.findOneAndDelete({ _id: id })
			.exec();
		return deletedSub;
	}
}
