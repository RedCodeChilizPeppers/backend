import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Public } from 'src/decorators/public.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@Controller('transaction')
export class TransactionController {
	constructor(private readonly transactionService: TransactionService) {}

	@UseGuards(JwtAuthGuard)
	@Post('create')
	create(@Body() createTransactionDto: CreateTransactionDto) {
		return this.transactionService.create(createTransactionDto);
	}

	@Get('all')
	findAll() {
		return this.transactionService.findAll();
	}

	@UseGuards(JwtAuthGuard)
	@Get('allbyid/:id')
	findAllByUserId(@Param('id') id: string) {
		return this.transactionService.findAllByUserId(id);
	}

	@Public()
	@Post('updatepending/all')
	changeTransactionPending() {
		return this.transactionService.changeTransactionPending();
	}


	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.transactionService.findOne(id);
	}

	@Patch('update/:id')
	update(
		@Param('id') id: string,
		@Body() updateTransactionDto: UpdateTransactionDto,
	) {
		return this.transactionService.update(id, updateTransactionDto);
	}

	@Delete('delete/:id')
	remove(@Param('id') id: string) {
		return this.transactionService.remove(id);
	}
}
