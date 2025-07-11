import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateLanguageDto } from './dto/create-language.dto';
import { UpdateLanguageDto } from './dto/update-language.dto';
import { Language, LanguageDocument } from './schemas/language.schema';

@Injectable()
export class LanguageService {
	constructor(
		@InjectModel(Language.name)
		private languageModel: Model<LanguageDocument>,
	) {}
	async create(createLanguageDto: CreateLanguageDto) {
		const createLang = await this.languageModel.create(createLanguageDto);
		return createLang;
	}

	findAll() {
		return this.languageModel.find();
	}

	findOne(id: string) {
		return this.languageModel.findOne({ _id: id }).exec();
	}

	async update(id: string, updateLanguageDto: UpdateLanguageDto) {
		const updateLang = await this.languageModel.findOneAndUpdate(
			{ _id: id },
			updateLanguageDto,
		);
		return updateLang;
	}

	async remove(id: string) {
		const deletedLang = await this.languageModel
			.findOneAndDelete({ _id: id })
			.exec();
		return deletedLang;
	}
}
