import { Test, TestingModule } from '@nestjs/testing';
import { TalentsService } from './talent.service';

describe('TalentsService', () => {
	let service: TalentsService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [TalentsService],
		}).compile();

		service = module.get<TalentsService>(TalentsService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});
});
