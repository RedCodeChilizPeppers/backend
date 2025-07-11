import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderbookModule } from 'src/orderbook/orderbook.module';
import { S3Module } from 'src/s3/s3.module';
import { User, UserSchema } from './schemas/user.schema';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
	imports: [
		S3Module,
		MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
		forwardRef(() => OrderbookModule),
	],
	controllers: [UserController],
	providers: [UserService],
	exports: [UserService],
})
export class UserModule {}
