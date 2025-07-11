import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { MailingAddressService } from './mailing-address.service';
import { CreateMailingAddressDto } from './dto/create-mailing-address.dto';
import { UpdateMailingAddressDto } from './dto/update-mailing-address.dto';

@Controller('mailing-address')
export class MailingAddressController {
	constructor(
		private readonly mailingAddressService: MailingAddressService,
	) {}

	@Post('create')
	create(@Body() createMailingAddressDto: CreateMailingAddressDto) {
		const newMailingAddress = this.mailingAddressService.create(
			createMailingAddressDto,
		);
	}

	@Get('all')
	findAll() {
		return this.mailingAddressService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.mailingAddressService.findOne(id);
	}

	@Patch('update/:id')
	update(
		@Param('id') id: string,
		@Body() updateMailingAddressDto: UpdateMailingAddressDto,
	) {
		return this.mailingAddressService.update(id, updateMailingAddressDto);
	}

	@Delete('delete/:id')
	remove(@Param('id') id: string) {
		return this.mailingAddressService.remove(id);
	}
}
