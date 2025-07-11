import { TalentsGateway } from './talents/talents.gateway';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { GamesModule } from './games/games.module';
import { TalentsModule } from './talents/talent.module';
import { MailingAddressModule } from './mailing-address/mailing-address.module';
import { ConfigModule } from '@nestjs/config';
import { TokenPriceHistoryModule } from './token-price-history/token-price-history.module';
import { SocialNetworkModule } from './social-network/social-network.module';
import { CategoriesModule } from './categories/categories.module';
import { UserAdminModule } from './user-admin/user-admin.module';
import { MetricsModule } from './metrics/metrics.module';
import { NotificationsModule } from './notifications/notifications.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { TransactionModule } from './transaction/transaction.module';
import { LanguageModule } from './language/language.module';
import { CaslModule } from './casl/casl.module';
import { PaymentModule } from './payment/payment.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailersService } from './mailer/mailers.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { OrderbookModule } from './orderbook/orderbook.module';
import { WaitingListModule } from './waiting-list/waitingList.module';
import { HealthModule } from './health/health.module';
// import { S3Service } from './s3/s3.service';
// import { S3Module } from './s3/s3.module';
import * as Joi from 'joi';

@Module({
	imports: [
		ConfigModule.forRoot({
			validationSchema: Joi.object({
				NODE_ENV: Joi.string()
					.valid('development', 'production', 'test', 'provision')
					.default('development'),
				PORT: Joi.number().default(8080),
				DATABASE_URI: Joi.string().required(),
				MAILFORM: Joi.string().required(),
				MAILSERVICE: Joi.string().required(),
				MAILHOST: Joi.string().required(),
				MAILUSER: Joi.string().email().required(),
				MAILPASS: Joi.string().required(),
				BASEURL: Joi.string().uri().required(),
				STRIPE_SECRET_KEY: Joi.string().required(),
				STRIPE_ENDPOINT_SECRET: Joi.string().required(),
				AWS_REGION: Joi.string().required(),
				AWS_ACCESS_KEY_ID: Joi.string().required(),
				AWS_SECRET_ACCESS_KEY: Joi.string().required(),
			}),
		}),
		MongooseModule.forRoot(process.env.DATABASE_URI),
		MailerModule.forRoot({
			transport: `smtps://${process.env.MAILUSER}@lootingg.com:${process.env.MAILPASS}@${process.env.MAILHOST}`,
			template: {
				dir: __dirname + '/mails',
				adapter: new HandlebarsAdapter(), // or new PugAdapter()
			},
		}),
		UserModule,
		AuthModule,
		GamesModule,
		TalentsModule,
		MailingAddressModule,
		TokenPriceHistoryModule,
		SocialNetworkModule,
		CategoriesModule,
		UserAdminModule,
		MetricsModule,
		NotificationsModule,
		SubscriptionModule,
		TransactionModule,
		LanguageModule,
		CaslModule,
		PaymentModule,
		OrderbookModule,
		WaitingListModule,
		HealthModule,
		// S3Module,
	],
	controllers: [AppController],
	providers: [
		TalentsGateway,
		MailersService,
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		},
		AppService,
		// S3Service,
	],
})
export class AppModule {}
