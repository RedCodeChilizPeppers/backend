import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateWaitingListDto } from './dto/create-waitingList.dto';
import { UpdateWaitingListDto } from './dto/update-waitingList.dto';
import { WaitingList, WaitingListDocument } from './schemas/waitingList.schema';

@Injectable()
export class WaitingListService {
	constructor(
		@InjectModel(WaitingList.name)
		private WaitingListModel: Model<WaitingListDocument>,
	) {}
	async create(createWaitingListDto: CreateWaitingListDto) {
		const createTrans = await this.WaitingListModel.create(
			createWaitingListDto,
		);
		return createTrans;
	}
  
	findAllByUserId(id: string) {
		return this.WaitingListModel
			.find({ userId: id })
			.populate('talent')
			.sort({ updatedAt: -1 })
			.exec();
			
	}

  findAll() {
    return `This action returns all WaitingList`;
  }

  findOne(id: number) {
    return `This action returns a #${id} WaitingList`;
  }
  
	async changestatuslist(id: string) {
		const updateStatusList = await this.WaitingListModel.findOneAndUpdate(
			{ _id: id },
			{status: "canceled"}
		);
		return updateStatusList;
	}

  update(id: number, updateWaitingListDto: UpdateWaitingListDto) {
    return `This action updates a #${id} WaitingList`;
  }

  remove(id: number) {
    return `This action removes a #${id} WaitingList`;
  }
}
