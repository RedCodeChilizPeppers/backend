import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateOrderbookDto } from './dto/create-orderbook.dto';
import { UpdateOrderbookDto } from './dto/update-orderbook.dto';
import { Orderbook, OrderbookDocument } from './schemas/orderbook.schema';

@Injectable()
export class OrderbookService {
	constructor(
		@InjectModel(Orderbook.name)
		private orderbookModel: Model<OrderbookDocument>,
	) {}
	async create(createOrderbookDto: CreateOrderbookDto) {
		const createTrans = await this.orderbookModel.create(
			createOrderbookDto,
		);
		return createTrans;
	}

	findAllByUserId(id: string) {
		return this.orderbookModel
			.find({ userId: id })
			.populate('talent')
			.sort({ updatedAt: -1 })
			.exec();
	}
	findAllByTalentId(
		id: string,
		limit?: number,
		filter: any = {},
		sort: any = {},
	) {
		return this.orderbookModel
			.find({ talent: id, ...filter })
			.sort({ updatedAt: -1 })
			.limit(limit ?? 30)
			.exec();
	}
	findAllWithFilter(filter: any = {}) {
		if (Object.keys(filter).length < 0) throw new Error('filter empty');
		return this.orderbookModel.find({ filter }).exec();
	}
	count(filter: any = {}) {
		return this.orderbookModel.count(filter).exec();
	}

	findOne(id: number) {
		return `This action returns a #${id} orderbook`;
	}

	async countSellNowByIdTalent(id: string, filter: any = { status: "pending", method: "sell" }) {
		const countSellNow = await this.orderbookModel
			.find({ talent: id, ...filter })
			.exec();
		if (!countSellNow || countSellNow.length === 0) {
			return 0;
		}
		
		const totalTokens = countSellNow.reduce((acc, curr) => {
			return acc + curr.numberToken;
		}, 0);

		return totalTokens;
	}
	  

	async changeStatusOrderbook(id: string) {
		const updateStatusOrder = await this.orderbookModel.findOneAndUpdate(
			{ _id: id },
			{ status: 'canceled' },
		);
		return updateStatusOrder;
	}
	
	async update(id: string, updateOrderbookDto: UpdateOrderbookDto) {
		const orderBookUpdate = await this.orderbookModel.findOneAndUpdate(
			{ _id: id },
			updateOrderbookDto,
		);
		return orderBookUpdate;
	}

	remove(id: number) {
		return `This action removes a #${id} orderbook`;
	}
}
