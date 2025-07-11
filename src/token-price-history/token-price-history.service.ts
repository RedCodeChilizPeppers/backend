import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTokenPriceHistoryDto } from './dto/create-token-price-history.dto';
import { UpdateTokenPriceHistoryDto } from './dto/update-token-price-history.dto';
import { TokenPriceHistory } from './entities/token-price-history.entity';
import { TokenPriceHistoryDocument } from './schemas/token-price-history.schema';

@Injectable()
export class TokenPriceHistoryService {
	constructor(
		@InjectModel(TokenPriceHistory.name)
		private tokenPriceHistoryModel: Model<TokenPriceHistoryDocument>,
	) {}
	async create(createTokenPriceHistoryDto: CreateTokenPriceHistoryDto) {
		const createTPH = await this.tokenPriceHistoryModel.create(
			createTokenPriceHistoryDto,
		);
		return createTPH;
	}
	
	async createsave(createTokenPriceHistoryDto: CreateTokenPriceHistoryDto) {
		const createSaveData = await this.tokenPriceHistoryModel.create(
			createTokenPriceHistoryDto,
		);
		return createSaveData;
	}

	findAll() {
		return this.tokenPriceHistoryModel.find();
	}

	findAllByTalent(id: string) {
		return this.tokenPriceHistoryModel.find({ talent: id }).sort({ updatedAt: -1 }).exec();
		
	}

	findOne(id: string) {
		return this.tokenPriceHistoryModel.findOne({ _id: id }).exec();
	}

	async update(
		id: string,
		updateTokenPriceHistoryDto: UpdateTokenPriceHistoryDto,
	) {
		const updateTPH = await this.tokenPriceHistoryModel.findOneAndUpdate(
			{ _id: id },
			updateTokenPriceHistoryDto,
		);
		return updateTPH;
	}

	async remove(id: string) {
		const deletedTPH = await this.tokenPriceHistoryModel
			.findByIdAndRemove({ _id: id })
			.exec();
		return deletedTPH;
	}
}
