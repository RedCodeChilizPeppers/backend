import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
	BadRequestException,
} from '@nestjs/common';
import { OrderbookService } from './orderbook.service';
import { CreateOrderbookDto } from './dto/create-orderbook.dto';
import { UpdateOrderbookDto } from './dto/update-orderbook.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Public } from 'src/decorators/public.decorator';
import { UserService } from 'src/user/user.service';
import { Talent } from 'src/talents/schemas/talent.schema';

@Controller('orderbook')
export class OrderbookController {
	constructor(
		private readonly orderbookService: OrderbookService,
		private readonly userService: UserService,
	) {}

	@Post('create')
	async create(@Body() createOrderbookDto: CreateOrderbookDto) {
		const user = await this.userService.findOneById(
			createOrderbookDto.userId,
		);
		if (!user.portfolioTalent) throw new BadRequestException();

		const portfolioTalent = user.portfolioTalent as {
			amount: number;
			talent: Talent;
		}[];
		const amount = portfolioTalent.map((folio) => {
			console.log("folio.talent._id", folio.talent._id.toString());
			console.log("createOrderbookDto.talent", createOrderbookDto.talent);
			
			if (
				folio.talent._id.toString() === createOrderbookDto.talent.toString()
			)
				return folio.amount;
		});
		const sum = amount.reduce((partialSum, a) => partialSum + a, 0);
		if (sum < createOrderbookDto.numberToken)
			throw new BadRequestException();

		return this.orderbookService.create(createOrderbookDto);
	}

	// @Get()
	// findAll() {
	// 	return this.orderbookService.findAll();
	// }

	@UseGuards(JwtAuthGuard)
	@Get('all/:id')
	findAllByUserId(@Param('id') id: string) {
		return this.orderbookService.findAllByUserId(id);
	}

	@UseGuards(JwtAuthGuard)
	@Patch('updatestatus/:id')
	changeStatusOrderbook(@Param('id') id: string) {
		return this.orderbookService.changeStatusOrderbook(id);
	}
	
	@Public()
	@Get('lttsalenow/:id')
	async countLTTSaleNow(@Param('id') id: string) {
		const LTTSaleNow = await this.orderbookService.countSellNowByIdTalent(id)
		return LTTSaleNow;
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.orderbookService.findOne(+id);
	}

	@Patch(':id')
	update(
		@Param('id') id: string,
		@Body() updateOrderbookDto: UpdateOrderbookDto,
	) {
		return this.orderbookService.update(id, updateOrderbookDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.orderbookService.remove(+id);
	}
}
