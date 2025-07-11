import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalAdminStrategy extends PassportStrategy(
	Strategy,
	'local-admin',
) {
	constructor(private authService: AuthService) {
		super({ usernameField: 'email' });
	}

	async validate(email: string, password: string): Promise<any> {
		console.log('validateAdmin');
		const user = await this.authService.validateUserAdmin(email, password);
		if (!user) {
			throw new UnauthorizedException({
				description: 'validate admin fail',
			});
		}
		return user;
	}
}
