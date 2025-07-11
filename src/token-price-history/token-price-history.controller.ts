import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { TokenPriceHistoryService } from './token-price-history.service';
import { CreateTokenPriceHistoryDto } from './dto/create-token-price-history.dto';
import { UpdateTokenPriceHistoryDto } from './dto/update-token-price-history.dto';
import { TalentsService } from '../talents/talent.service';
import { OrderbookService } from 'src/orderbook/orderbook.service';

@Controller('token-price-history')
export class TokenPriceHistoryController {
	constructor(
		private readonly tokenPriceHistoryService: TokenPriceHistoryService,
		private readonly talentsService: TalentsService,
		private readonly orderbookService : OrderbookService,
	) {}

	@Post('create')
	create(@Body() createTokenPriceHistoryDto: CreateTokenPriceHistoryDto) {
		return this.tokenPriceHistoryService.create(createTokenPriceHistoryDto);
	}

	@Post('createsave')
	async createsave() {
		const talents = await this.talentsService.findAll();
		for (const talent of talents) {
			await this.tokenPriceHistoryService.create({
			  talent: talent,
			  price: talent.price,
			  currency: talent.currency,
			});
			// Si il n'y a pas d'ordre de vente créer en cours sur le site.
			const OrdreDeVenteEnCours = await this.orderbookService.findAllByTalentId(talent._id.toString(),10,{status: "pending"})
			if (OrdreDeVenteEnCours.length === 0) {
				if (talent.isSalable == true) {
					// On vérifie qu'il reste des tokens à disposition
					const LTTLeft = await this.talentsService.getLTTLeft(talent._id.toString());
					const LTTCheckLeft = LTTLeft.snapshotBlockchain[0].sellActually;
					// On génere un nombre aléatoire de LTT qui vont etre créer compris entre 10 et 30.
					const getRandomNumber = Math.floor(Math.random() * 29) + 2;
					// On vérifie que le nombre de LTT en vente est inférieur au nombre de LTT restant
					if (LTTCheckLeft > getRandomNumber) {
						// On créer un orderbook en tant qu'admin au dernier prix
						const formData = {
							userId : process.env.ID_ADMIN,
							talent : talent,
							method : "sell",
							price : talent.price,
							numberToken : getRandomNumber,
							currency : talent.currency,
							status : "pending"
						}
						const createOrderBookByAdmin = await this.orderbookService.create(formData);
						createOrderBookByAdmin;
					}
				}
			}
		}
	}

	@Get('all')
	findAll() {
		return this.tokenPriceHistoryService.findAll();
	}

	@Get('all/:id')
	findAllByTalent(@Param('id') id: string) {
		return this.tokenPriceHistoryService.findAllByTalent(id);
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.tokenPriceHistoryService.findOne(id);
	}

	@Patch('update/:id')
	update(
		@Param('id') id: string,
		@Body() updateTokenPriceHistoryDto: UpdateTokenPriceHistoryDto,
	) {
		return this.tokenPriceHistoryService.update(
			id,
			updateTokenPriceHistoryDto,
		);
	}

	@Delete('delete/:id')
	remove(@Param('id') id: string) {
		return this.tokenPriceHistoryService.remove(id);
	}
}
