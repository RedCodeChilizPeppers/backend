import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Categories, CategoriesDocument } from './schemas/categories.schema';
@Injectable()
export class CategoriesService {
	constructor(
		@InjectModel(Categories.name)
		private categoriesModel: Model<CategoriesDocument>,
	) {}
	async create(createCategoryDto: CreateCategoryDto) {
		const createCat = await this.categoriesModel.create(createCategoryDto);
		return createCat;
	}

	findAll() {
		return this.categoriesModel.find();
	}

	findOne(id: string) {
		return this.categoriesModel.findOne({ _id: id }).exec();
	}

	async update(id: string, updateCategoryDto: UpdateCategoryDto) {
		const updateCat = await this.categoriesModel.findOneAndUpdate(
			{ _id: id },
			updateCategoryDto,
		);
		return updateCat;
	}

	async remove(id: string) {
		const deletedCat = await this.categoriesModel
			.findOneAndDelete({ _id: id })
			.exec();
		return deletedCat;
	}
}
