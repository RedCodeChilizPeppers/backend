import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserAdminDto } from './dto/create-user-admin.dto';
import { UpdateUserAdminDto } from './dto/update-user-admin.dto';
import { UserAdmin, UserAdminDocument } from './schemas/user-admin.schema';

@Injectable()
export class UserAdminService {
	constructor(
		@InjectModel(UserAdmin.name)
		private userAdminModel: Model<UserAdminDocument>,
	) {}
	async create(createUserAdminDto: CreateUserAdminDto) {
		const createAdmin = await this.userAdminModel.create(
			createUserAdminDto,
		);
		return createAdmin;
	}

	findAll() {
		return this.userAdminModel.find();
	}

	findOne(id: string) {
		return this.userAdminModel.findOne({ _id: id }).exec();
	}
	async findOneByEmail(email: string): Promise<UserAdmin | undefined> {
		return this.userAdminModel.findOne({ email: email }).exec();
	}
	async update(id: string, updateUserAdminDto: UpdateUserAdminDto) {
		const updateAdmin = await this.userAdminModel.findOneAndUpdate(
			{ _id: id },
			updateUserAdminDto,
		);
		return updateAdmin;
	}

	async remove(id: string) {
		const deletedAdmin = await this.userAdminModel
			.findOneAndDelete({ _id: id })
			.exec();
		return deletedAdmin;
	}
}
