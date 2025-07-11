import { Module } from '@nestjs/common';
import { MailingAddressService } from './mailing-address.service';
import { MailingAddressController } from './mailing-address.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
	MailingAddress,
	MailingAddressSchema,
} from './schemas/mailing-address.schema';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: MailingAddress.name, schema: MailingAddressSchema },
		]),
	],
	controllers: [MailingAddressController],
	providers: [MailingAddressService],
})
export class MailingAddressModule {}
