import { JwtStrategy } from './strategies/jwt.strategy';
import { UserModule } from './../user/user.module';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { LocalAdminStrategy } from './strategies/local-admin.strategy';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constantes';
import { AuthController } from './auth.controller';
import { UserAdminModule } from 'src/user-admin/user-admin.module';
import { MailersService } from 'src/mailer/mailers.service';
@Module({
	imports: [
		UserModule,
		UserAdminModule,
		PassportModule,
		JwtModule.register({
			secret: jwtConstants.secret,
			signOptions: { expiresIn: '3600s' },
		}),
	],
	providers: [
		AuthService,
		LocalStrategy,
		LocalAdminStrategy,
		JwtStrategy,
		MailersService,
	],
	exports: [AuthService],
	controllers: [AuthController],
})
export class AuthModule {}
