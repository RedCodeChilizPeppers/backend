import { Test, TestingModule } from '@nestjs/testing';
import { MailingAddressController } from './mailing-address.controller';
import { MailingAddressService } from './mailing-address.service';

describe('MailingAddressController', () => {
	let controller: MailingAddressController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [MailingAddressController],
			providers: [MailingAddressService],
		}).compile();

		controller = module.get<MailingAddressController>(
			MailingAddressController,
		);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
