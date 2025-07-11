import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateTalentDto } from './dto/create-talent.dto';
import { UpdateTalentDto } from './dto/update-talent.dto';
import { Talent, TalentDocument } from './schemas/talent.schema';

@Injectable()
export class TalentsService {
	constructor(
		@InjectModel(Talent.name) private talentModel: Model<TalentDocument>,
	) {}
	async create(createTalentDto: CreateTalentDto) {
		const createTalent = await this.talentModel.create(createTalentDto);
		return createTalent;
	}

	findAll() {
		return this.talentModel
			.find()
			.populate('game')
			.populate('category')
			.exec();
	}

	findLimit(limit: number) {
		return this.talentModel
			.find()
			.limit(limit)
			.populate('game')
			.populate('category')
			.exec();
	}

	findOne(id: string, sort: any = {}, limit = 0) {
		return this.talentModel
			.findOne({ _id: id })
			.populate('game')
			.populate('category')
			.sort(sort)
			.limit(limit)
			.exec();
	}
	findOneByNickname(nickname: string) {
		return this.talentModel.findOne({ nickname: nickname }).exec();
	}
	async update(id: string, updateTalentDto: UpdateTalentDto) {
		const updateTalent = await this.talentModel.findOneAndUpdate(
			{ _id: id },
			updateTalentDto,
		);
		return updateTalent;
	}

	async remove(id: string) {
		const deletedTalent = await this.talentModel
			.findOneAndDelete({ _id: id })
			.exec();
		return deletedTalent;
	}

	countAll() {
		return this.talentModel.find().countDocuments().exec();
	}
	
	async updateNumberParticipant(id: string, numberParticipant: number) {
		const updateNumberParticipants = await this.talentModel.findOneAndUpdate(
			{ _id: id },
				{
					$set: {
						'snapshotBlockchain.numberParticipants': numberParticipant,
					},
				},
		);
		return updateNumberParticipants;
	}
	
	async updateLTTLeft(id: string, lttLeft: number) {
		const updateNumberLTTLeft = await this.talentModel.findOneAndUpdate(
			{ _id: id },
				{
					$set: {
						'snapshotBlockchain.sellActually': lttLeft,
					},
				},
		);
		return updateNumberLTTLeft;
	}

	async getLTTLeft(id: string) {
		const getNumberLTTLeft = await this.talentModel.findOne(
			{_id: id}
		);
		return getNumberLTTLeft;
	}
	
	countNumberParticipants() {
		return this.talentModel.find().countDocuments().exec();
	}
}
