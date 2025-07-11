import {
	Controller,
	Get,
	UseGuards,
	Patch,
	Param,
	Body,
	Logger,
} from '@nestjs/common';
import mongoose from 'mongoose';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Public } from 'src/decorators/public.decorator';
import { S3Service } from 'src/s3/s3.service';
import { Talent } from 'src/talents/schemas/talent.schema';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';
import * as moment from 'moment';
import { OrderbookService } from 'src/orderbook/orderbook.service';

@Controller('user')
export class UserController {
	private readonly logger = new Logger(UserController.name);

	constructor(
		private readonly userService: UserService,
		private readonly s3Service: S3Service,
		private readonly orderbookService: OrderbookService,
	) {}

	@UseGuards(JwtAuthGuard)
	@Get('all')
	findAll() {
		return this.userService.findAll();
	}

	@UseGuards(JwtAuthGuard)
	@Get('referal/:id')
	async findGodfather(@Param('id') id: string) {
		console.log("ca marche ici ?");
		const findGodfather = await this.userService.findByGodFather(id);
		return findGodfather;
	}

	@UseGuards(JwtAuthGuard)
	@Get('kycconfirmed/all')
	async getUsersWithKycConfirmed() {
		const users = await this.userService.find({ kycConfirmed: "3" });
		const result = users.map(user => {
		  return {
			id: user._id,
			nickname: user.nickname,
			kycFile: user.kycFile
		  };
		});
		return result;
	  }


	@UseGuards(JwtAuthGuard)
	@Get(':id')
	async getOneUser(@Param('id') id: string) {
		const user = await this.userService.findOneById(id);
		for (const folio of user.portfolioTalent as {
			amount: number;
			talent: Talent;
		}[]) {
			try {
				const s3Avatar = await this.s3Service.s3GetObject(
					`avatar/${folio.talent.image}`,
					'media-front',
				);
				
				const base64 = s3Avatar.Body.toString('base64');
				folio.talent.image = `data:${s3Avatar.ContentType};base64,${base64}`;
				
				if (!moment().isBefore(folio.talent.publicSale)) {
					const order = await this.orderbookService.findAllByTalentId(
						folio.talent._id.toString(),
						1,
						{ txLocked: { $ne: true }, status: 'pending' },
						{ price: 1 },
					);

					if (order.length > 0) folio.talent.price = order[0].price;
				}
			} catch (error) {
				// this.logger.debug(`TalentsController:  ${error}`);
			}
		}
		return user;
	}
	
	
	@UseGuards(JwtAuthGuard)
	@Patch('update/:id')
	
	async updateUser(
		@Param('id') id: string,
		@Body() updateUserDto: UpdateUserDto,
	) {
		console.log("updateUserDto", updateUserDto);
		if (updateUserDto.kycFile === 'data') {
			const base64 = updateUserDto.kycFile.split(',')[1];
			const type = updateUserDto.kycFile.split(';')[0].split(':')[1];
			const nameFile = `kyc`;
			const buffer = Buffer.from(base64, 'base64');
			const s3file = await this.s3Service.s3Upload(
				buffer,
				`user/kyc/${id}`,
				nameFile,
				type,
			);
			console.log(s3file);
			updateUserDto.kycFile = nameFile;
			await this.userService.sendFileToDiscord(updateUserDto.kycFile);
		}
		return this.userService.update(id, updateUserDto);
	}

	
	@UseGuards(JwtAuthGuard)
	@Patch('updatekyc/:id')
	async updateUserKyc(
		@Param('id') id: string,
	) {
		const user = await this.userService.findOneByIdAndUpdateKyc(id);
		console.log("ok");
		return { message: 'Le KYC a été accepté pour l\'utilisateur avec l\'ID ' + id };
	}
	
	@UseGuards(JwtAuthGuard)
	@Patch('refusekyc/:id')
	async refusekyc(
		@Param('id') id: string,
	) {
		const user = await this.userService.findOneByIdAndRefuseKyc(id);
		console.log("ok");
		
		return { message: 'Le KYC a été refusé pour l\'utilisateur avec l\'ID ' + id };
	}

	

	@Public()
	@Get('count/all')
	countAllUsers() {
		return this.userService.findAllandCount();
	}
}
