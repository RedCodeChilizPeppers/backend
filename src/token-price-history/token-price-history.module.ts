import { Module, forwardRef } from '@nestjs/common';
import { TokenPriceHistoryService } from './token-price-history.service';
import { TokenPriceHistoryController } from './token-price-history.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { TokenPriceHistory } from './entities/token-price-history.entity';
import { TokenPriceHistorySchema } from './schemas/token-price-history.schema';
import { TalentsModule } from 'src/talents/talent.module';
import { OrderbookModule } from 'src/orderbook/orderbook.module';

@Module({
	imports: [
		forwardRef(() => TalentsModule),
		forwardRef(() => OrderbookModule),
		MongooseModule.forFeature([
			{ name: TokenPriceHistory.name, schema: TokenPriceHistorySchema },
		]),
	],
	controllers: [TokenPriceHistoryController],
	providers: [TokenPriceHistoryService],
	exports: [TokenPriceHistoryService],
})
export class TokenPriceHistoryModule {}
