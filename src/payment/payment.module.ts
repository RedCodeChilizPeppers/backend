import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { TransactionModule } from 'src/transaction/transaction.module';
import { NotificationsModule } from 'src/notifications/notifications.module';
import { UserModule } from 'src/user/user.module';
import { TalentsModule } from 'src/talents/talent.module';
import { OrderbookModule } from 'src/orderbook/orderbook.module';
import { MailersService } from 'src/mailer/mailers.service';

@Module({
	imports: [
		TransactionModule,
		NotificationsModule,
		UserModule,
		TalentsModule,
		OrderbookModule,
	],
	controllers: [PaymentController],
	providers: [PaymentService, MailersService],
})
export class PaymentModule {}
