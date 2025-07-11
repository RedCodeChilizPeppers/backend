import { Module } from '@nestjs/common';
import { WaitingListService } from './waitingList.service';
import { WaitingListController } from './waitingList.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { WaitingList, WaitingListSchema } from './schemas/waitingList.schema';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: WaitingList.name, schema: WaitingListSchema },
		]),
	],
  controllers: [WaitingListController],
  providers: [WaitingListService],
	exports: [WaitingListService],
})
export class WaitingListModule {}
