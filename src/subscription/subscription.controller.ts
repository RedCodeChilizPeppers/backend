import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@Controller('subscription')
export class SubscriptionController {
	constructor(private readonly subscriptionService: SubscriptionService) {}

	@Post('create')
	create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
		return this.subscriptionService.create(createSubscriptionDto);
	}

	@Get('all')
	findAll() {
		return this.subscriptionService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.subscriptionService.findOne(id);
	}
	
	@Patch('update/:id')
	update(
		@Param('id') id: string,
		@Body() updateSubscriptionDto: UpdateSubscriptionDto,
	) {
		return this.subscriptionService.update(id, updateSubscriptionDto);
	}

	@Delete('delete/:id')
	remove(@Param('id') id: string) {
		return this.subscriptionService.remove(id);
	}
}
