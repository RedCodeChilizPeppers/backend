import { Module } from '@nestjs/common';
import { UserAdminService } from './user-admin.service';
import { UserAdminController } from './user-admin.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserAdmin, UserAdminSchema } from './schemas/user-admin.schema';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: UserAdmin.name, schema: UserAdminSchema },
		]),
	],
	controllers: [UserAdminController],
	providers: [UserAdminService],
	exports: [UserAdminService],
})
export class UserAdminModule {}
