import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction, TransactionDocument } from './schemas/transaction.schema';

@Injectable()
export class TransactionService {
	constructor(
		@InjectModel(Transaction.name)
		private transactionModel: Model<TransactionDocument>,
	) {}
	async create(createTransactionDto: CreateTransactionDto) {
		const createTrans = await this.transactionModel.create(
			createTransactionDto,
		);
		return createTrans;
	}

	findAll() {
		return this.transactionModel.find();
	}

	findLimit(limit: number) {
		return this.transactionModel.find().limit(limit).exec();
	}

	// $orderby: {updatedAt: -1}

	findAllByUserId(id: string) {
		return this.transactionModel
			.find({ to: id })
			.sort({ updatedAt: -1 })
			.exec();
	}

	findSumLttSold(talentId: string) {
		return this.transactionModel
			.aggregate([
				{
					$match: {
						talentId: talentId,
						status: 'paid',
						from: [],
					},
				},
				{
					$group: { _id: null, totalSold: { $sum: '$quantity' } },
				},
			])
			.exec();
	}
	findOne(id: string) {
		return this.transactionModel.findOne({ _id: id }).exec();
	}
	
	async changeTransactionPending() {
		const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
		const updatedTransactions = await this.transactionModel
			.find({status: "pending", updatedAt: { $lt: tenMinutesAgo },})
			.updateMany({ status: "canceled" })
			.exec();
		return updatedTransactions;
	}


	async update(id: string, updateTransactionDto: UpdateTransactionDto) {
		const updateTrans = await this.transactionModel.findOneAndUpdate(
			{ _id: id },
			updateTransactionDto,
		);
		return updateTrans;
	}

	async remove(id: string) {
		const deletedTrans = await this.transactionModel
			.findByIdAndRemove({ _id: id })
			.exec();
		return deletedTrans;
	}
}
