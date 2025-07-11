import { Test, TestingModule } from '@nestjs/testing';
import { MailingAddressService } from './mailing-address.service';

describe('MailingAddressService', () => {
	let service: MailingAddressService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [MailingAddressService],
		}).compile();

		service = module.get<MailingAddressService>(MailingAddressService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
