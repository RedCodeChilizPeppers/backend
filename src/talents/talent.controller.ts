import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
	Logger,
} from '@nestjs/common';
import { TalentsService } from './talent.service';
import { CreateTalentDto } from './dto/create-talent.dto';
import { UpdateTalentDto } from './dto/update-talent.dto';
import { Public } from 'src/decorators/public.decorator';
import { TokenPriceHistoryService } from 'src/token-price-history/token-price-history.service';
import { PoliciesGuard } from 'src/auth/guards/policies.guard';
import { CheckPolicies } from 'src/decorators/check-policies.decorator';
import { ActionEnum } from 'src/enums/action.enum';
import { Talent } from './schemas/talent.schema';
import { TokenPriceHistory } from 'src/token-price-history/schemas/token-price-history.schema';
import { S3Service } from 'src/s3/s3.service';
import { OrderbookService } from 'src/orderbook/orderbook.service';
import * as moment from 'moment';
import { UserService } from 'src/user/user.service';

@Controller('talents')
export class TalentsController {
	private readonly logger = new Logger(TalentsController.name);

	constructor(
		private readonly talentsService: TalentsService,
		private readonly tokenPriceHistoryService: TokenPriceHistoryService,
		private readonly orderbookService: OrderbookService,
		private readonly s3Service: S3Service,
		private readonly userService: UserService,
	) {}

	//create decorateur IsAdmin
	@UseGuards(PoliciesGuard)
	@CheckPolicies((ability: AppAbility) => ability.can(ActionEnum.MANAGE))
	@Post('create')
	async create(@Body() createTalentDto: CreateTalentDto) {
		if (createTalentDto.image.slice(0, 4) === 'data') {
			const base64 = createTalentDto.image.split(',')[1];
			const type = createTalentDto.image.split(';')[0].split(':')[1];
			const nameFile = `${createTalentDto.nickname}_avatar`;
			const buffer = Buffer.from(base64, 'base64');
			const s3file = await this.s3Service.s3Upload(
				buffer,
				'media-front/avatar',
				nameFile,
				type,
			);
			console.log(s3file);
			createTalentDto.image = nameFile;
		}
		return this.talentsService.create(createTalentDto);
	}

	@Public()
	@Get('all/:limit')
	async findAll(@Param('limit') limit: string) {
		const talentsWithPrice: Array<{
			talent: Talent;
			prices: TokenPriceHistory[];
		}> = [];
		const talents =
			+limit > 0
				? await this.talentsService.findLimit(+limit)
				: await this.talentsService.findAll();
		for (const talent of talents) {
			if (talent.isSalable == true) {
				const order = await this.orderbookService.findAllByTalentId(
					talent._id.toString(),
					1,
					{ txLocked: { $ne: true }, status: 'selled' },
				);
				order.length > 0
					? (talent.price = order[0].price)
					: (talent.price = talent.introductionValue);
			}
			
			talentsWithPrice.push({
				talent: talent,
				prices: await this.tokenPriceHistoryService.findAllByTalent(
					talent._id,
				),
			});
			
			try {
				const s3Avatar = await this.s3Service.s3GetObject(
					`avatar/${talent.image}`,
					'media-front',
				);
				const base64 = s3Avatar.Body.toString('base64');
				talent.image = `data:${s3Avatar.ContentType};base64,${base64}`;
			} catch (error) {
				// this.logger.debug(`TalentsController findAll:  ${error}`);
			}
		}
		return talentsWithPrice;
	}

	@Public()
	@Get(':id')
	async findOne(@Param('id') id: string) {
		const talent = await this.talentsService.findOne(id);
		if (!moment().isBefore(talent.publicSale)) {
			console.log('test id');
			const order = await this.orderbookService.findAllByTalentId(
				talent._id.toString(),
				1,
				{ txLocked: { $ne: true }, status: 'pending' },
			);
			console.log('test id', order);
			order.length > 0
				? (talent.price = order[0].price)
				: (talent.price = -1);
		}
		const s3Avatar = await this.s3Service.s3GetObject(
			`avatar/${talent.image}`,
			'media-front',
		);
		const base64 = s3Avatar.Body.toString('base64');
		talent.image = `data:${s3Avatar.ContentType};base64,${base64}`;
		return talent;
	}
	@Public()
	@Get('with-price/:id')
	async findOneWithPrice(@Param('id') id: string) {
		const talent = await this.talentsService.findOne(id);
		
		// Si on est en vente publique
		// if (!moment().isBefore(talent.publicSale)) {
			if (talent.isSalable == true) {
				const order = await this.orderbookService.findAllByTalentId(
					talent._id.toString(),
					1,
					{ txLocked: { $ne: true }, status: 'selled' },
				);
				
				const prices = await this.tokenPriceHistoryService.findAllByTalent(id);

				// const newPriceAugmentation = Number((prices[0].price * 1.12).toFixed(2));
				const randomPercentage = 0.08 + Math.random() * 0.07; // générer un nombre aléatoire entre 8% et 15%
				const newPriceAugmentation = Number((prices[0].price * (1 + randomPercentage)).toFixed(2));

				order.length > 0
					? (talent.price = order[0].price)
					// Remplacer le prix de -1€ au dernier prix connu + 12% d'augmentation
					: (talent.price = newPriceAugmentation);
				const newPrice: UpdateTalentDto = {
					price: talent.price
				};
				const UpdatePriceTalent = await this.update(id, newPrice);
				UpdatePriceTalent;
			}
		try {
			const s3Avatar = await this.s3Service.s3GetObject(
				`avatar/${talent.image}`,
				'media-front',
			);
			const base64 = s3Avatar.Body.toString('base64');
			talent.image = `data:${s3Avatar.ContentType};base64,${base64}`;
		} catch (error) {
			// this.logger.debug(`TalentsController findOne:  ${error}`);
		}
		const prices = await this.tokenPriceHistoryService.findAllByTalent(id);
		
		
		return { talent: talent, prices: prices };
	}

	@Patch('update/:id')
	update(@Param('id') id: string, @Body() updateTalentDto: UpdateTalentDto) {
		return this.talentsService.update(id, updateTalentDto);
	}

	@Delete('delete/:id')
	remove(@Param('id') id: string) {
		return this.talentsService.remove(id);
	}

	@Get('count/numberparticipant/:id')
	async countNumberParticipant(@Param('id') id: string) {
		const numberParticipant = await this.userService.findAllByTalent(id)
		return numberParticipant;
	}

	@Get('count/lttrestant/:id')
	async countLTTLeft(@Param('id') id: string) {
		const LTTLeft = await this.userService.countAmountByTalent(id)
		return LTTLeft;
	}

	@Public()
	@Get('count/all')
	countAllUsers() {
		return this.talentsService.countAll();
	}
}
