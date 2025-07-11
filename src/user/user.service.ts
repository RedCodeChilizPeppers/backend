import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { PortfolioUserDto } from './dto/portfolio-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';
import fetch from 'node-fetch';

@Injectable()
export class UserService {
	constructor(
		@InjectModel(User.name) private userModel: Model<UserDocument>,
	) {}
	async create(createUserDto: CreateUserDto) {
		if (await this.findOneByEmail(createUserDto.email))
			throw new HttpException(
				'This email is already use !',
				HttpStatus.CONFLICT,
			);

		const createUser = await this.userModel.create(createUserDto);
		return createUser;
	}
	async update(_id: string, updateUserDto: UpdateUserDto) {
		const updateUser = await this.userModel.findOneAndUpdate(
			{ _id: _id },
			updateUserDto,
		);
		return updateUser;
	}

	async updatePw(_id: string, data: any): Promise<any> {
		const newPassword = await bcrypt.hash(data.password, 12);
		const updateUser = await this.userModel.findOneAndUpdate(
			{ _id: _id },
			{ password: newPassword, forgetToken: '' },
		);

		return updateUser;
	}

	async newPortfolio(_id: string, portfolioUserDto: PortfolioUserDto) {
		const updateUser = await this.userModel.findOneAndUpdate(
			{ _id: _id },
			{
				$push: {
					portfolioTalent: { ...portfolioUserDto.portfolioTalent },
				},
			},
		);
		return updateUser;
	}
	async updatePortfolio(
		idUser: string,
		idPortfolio: string,
		portfolioUserDto: PortfolioUserDto,
	) {
		const updatePortfolio = await this.userModel.findOneAndUpdate(
			{ _id: idUser, 'portfolioTalent._id': idPortfolio },
			{
				$set: {
					'portfolioTalent.$': portfolioUserDto.portfolioTalent,
				},
			},
		);
		return updatePortfolio;
	}
	
	async find(query: Partial<User>): Promise<User[]> {
		return this.userModel.find(query);
	  }

	async findOneByEmail(email: string) {
		return this.userModel
			.findOne({ email: email })
			.populate({ path: 'portfolioTalent.talent' })
			.exec();
	}
	async findOneById(id: string) {
		const user = await this.userModel
			.findOne({ _id: id })
			.populate({ path: 'portfolioTalent.talent' })
			.exec();
		return user;
	}
	async findOneWithId(id: string) {
		const user = await this.userModel.findOne({ _id: id }).exec();
		return user;
	}
	
	async findAllByTalent(id: string) {
		const talentId = await this.userModel
		.countDocuments({ 'portfolioTalent.talent': id })
		.exec()
		return talentId;
	}
	
	// Push dans le chanel paiement sur discord
	async sendFileToDiscord(kycFile: string) {
		const Fichier = kycFile.split(",")[1];
	  
		const response = await fetch(
		  "https://discord.com/api/webhooks/1087004929652174950/wdyMwbHyOsANlSA2O9tNDmPvUy0b3Zytxbv2gcBqE6VThQS4_YLmRk-ibeNv4FCes2gg",
		  {
			method: "POST",
			headers: {
			  "Content-Type": "application/json",
			},
			body: JSON.stringify({
			  username: "KYC",
			  avatar_url: "",
			  content: "👀 Il faut valider un document KYC sur la backend administrateur.",
			}),
		  }
		);
	  
		if (response.ok) {
		  return "Notification envoyée sur Discord.";
		} else {
		  throw new Error(
			"Une erreur est survenue lors de l'envoi de la notification Discord."
		  );
		}
	}
	  
	async countAmountByTalent(id: string) {
		const result = await this.userModel.aggregate([
			{ $match: { "portfolioTalent.talent": new Types.ObjectId(id) } },
			{ $unwind: "$portfolioTalent" },
			{
			  $group: {
				_id: null,
				totalAmount: { $sum: "$portfolioTalent.amount" }
			  }
			}
		  ]).exec();
		
		  if (!result || result.length === 0) {
			return 0;
		  }
		
		  return result[0].totalAmount;

	  }

	async findOneByAffiliate(affiliateCode: string) {
		return this.userModel.findOne({ affiliateCode: affiliateCode }).exec();
	}
	
	async findByGodFather(id: string) {
		return this.userModel.find({ referral: id }).exec();
	}

	async findOneByActivation(activationToken: string) {
		const activationTokenUser = await this.userModel.findOneAndUpdate(
			{ activationToken: activationToken },
			{
				$set: {
					isConfirmed: true,
				},
			},
		);
		return activationTokenUser;
	}

	async findOneByIdAndUpdateKyc(id: string) {
		const findandUpdate = await this.userModel.findOneAndUpdate(
			{ _id: id },
			{
				$set: {
					kycConfirmed: "1",
				},
			},
		);
		return findandUpdate;
	}
	
	async findOneByIdAndRefuseKyc(id: string) {
		const RefuseKyc = await this.userModel.findOneAndUpdate(
			{ _id: id },
			{
				$set: {
					kycConfirmed: "2",
				},
			},
		);
		return RefuseKyc;
	}


	async findOneByForgetToken(forgetToken: string) {
		return this.userModel.findOne({ forgetToken: forgetToken }).exec();
	}

	async setForgetToken(forgetToken: string, email: string) {
		const setForgetToken = await this.userModel.findOneAndUpdate(
			{ email: email },
			{
				$set: {
					forgetToken: forgetToken,
				},
			},
		);
		return setForgetToken;
	}

	getHello(): string {
		return 'Hello World!';
	}

	findAll() {
		return this.userModel.find();
	}

	findAllandCount() {
		return this.userModel.countDocuments();
	}

	count() {
		return this.userModel.countDocuments();
	}
	

}
