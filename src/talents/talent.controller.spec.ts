import { Test, TestingModule } from '@nestjs/testing';
import { TalentsController } from './talent.controller';
import { TalentsService } from './talent.service';

describe('TalentsController', () => {
	let controller: TalentsController;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [TalentsController],
			providers: [TalentsService],
		}).compile();

		controller = module.get<TalentsController>(TalentsController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
