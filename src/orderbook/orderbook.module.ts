import { forwardRef, Module } from '@nestjs/common';
import { OrderbookService } from './orderbook.service';
import { OrderbookController } from './orderbook.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Orderbook, OrderbookSchema } from './schemas/orderbook.schema';
import { UserModule } from 'src/user/user.module';

@Module({
	imports: [
		forwardRef(() => UserModule),
		MongooseModule.forFeature([
			{ name: Orderbook.name, schema: OrderbookSchema },
		]),
	],
	controllers: [OrderbookController],
	providers: [OrderbookService],
	exports: [OrderbookService],
})
export class OrderbookModule {}
