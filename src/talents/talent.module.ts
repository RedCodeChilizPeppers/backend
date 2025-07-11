import { Module } from '@nestjs/common';
import { TalentsService } from './talent.service';
import { TalentsController } from './talent.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Talent, TalentSchema } from './schemas/talent.schema';
import { TokenPriceHistoryModule } from 'src/token-price-history/token-price-history.module';
import { CaslModule } from 'src/casl/casl.module';
import { S3Module } from 'src/s3/s3.module';
import { OrderbookModule } from 'src/orderbook/orderbook.module';
import { TalentsGateway } from './talents.gateway';
import { TransactionModule } from 'src/transaction/transaction.module';
import { UserModule } from 'src/user/user.module';

@Module({
	imports: [
		CaslModule,
		TokenPriceHistoryModule,
		OrderbookModule,
		TransactionModule,
		S3Module,
		UserModule,
		MongooseModule.forFeature([
			{ name: Talent.name, schema: TalentSchema },
		]),
	],
	controllers: [TalentsController],
	providers: [TalentsService, TalentsGateway],
	exports: [TalentsService],
})
export class TalentsModule {}
