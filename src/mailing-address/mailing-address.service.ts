import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMailingAddressDto } from './dto/create-mailing-address.dto';
import { UpdateMailingAddressDto } from './dto/update-mailing-address.dto';
import {
	MailingAddress,
	MailingAddressDocument,
} from './schemas/mailing-address.schema';

@Injectable()
export class MailingAddressService {
	constructor(
		@InjectModel(MailingAddress.name)
		private mailingAddressModel: Model<MailingAddressDocument>,
	) {}
	async create(createMailingAddressDto: CreateMailingAddressDto) {
		const createAddr = await this.mailingAddressModel.create(
			createMailingAddressDto,
		);
		return createAddr;
	}

	findAll() {
		return this.mailingAddressModel.find();
	}

	findOne(id: string) {
		return this.mailingAddressModel.findOne({ _id: id }).exec();
	}

	async update(id: string, updateMailingAddressDto: UpdateMailingAddressDto) {
		const updateLang = await this.mailingAddressModel.findOneAndUpdate(
			{ _id: id },
			updateMailingAddressDto,
		);
		return updateLang;
	}

	async remove(id: string) {
		const deletedLang = await this.mailingAddressModel
			.findOneAndDelete({ _id: id })
			.exec();
		return deletedLang;
	}
}
