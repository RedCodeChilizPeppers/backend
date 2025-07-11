import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/schemas/user.schema';
import { UserAdmin } from 'src/user-admin/schemas/user-admin.schema';
import { randomBytes } from 'crypto';
import { UserAdminService } from 'src/user-admin/user-admin.service';

@Injectable()
export class AuthService {
	constructor(
		private userService: UserService,
		private userAdminService: UserAdminService,
		private jwtService: JwtService,
	) {}

	async validateUserAdmin(
		email: string,
		pass: string,
	): Promise<UserAdmin | null> {
		const user = await this.userAdminService.findOneByEmail(email);
		const isMatch = await bcrypt.compare(pass, user.password);
		if (user && isMatch) {
			return user;
		}
		return null;
	}
	async validateUser(email: string, pass: string): Promise<User | null> {
		const user = await this.userService.findOneByEmail(email);
		const isMatch = await bcrypt.compare(pass, user.password);
		if (user && isMatch) {
			return user;
		}
		return null;
	}
	async login(user: any) {
		const payload = { email: user.email, sub: user._id };
		return {
			access_token: this.jwtService.sign(payload),
			user,
		};
	}
	async loginAdmin(user: any) {
		const payload = { email: user.email, sub: user._id };
		return {
			access_token: this.jwtService.sign(payload),
			user,
		};
	}
	async hash(password: string): Promise<string> {
		const hash = await bcrypt.hash(password, 12);
		return hash;
	}

	generateAffiliateCode(): string {
		const chars =
			'0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
		let referralCode = '';
		for (let i = 0; i <= 8; i++) {
			const randomNumber = Math.floor(Math.random() * chars.length);
			referralCode += chars.substring(randomNumber, randomNumber + 1);
		}
		return referralCode;
	}

	async token(): Promise<string> {
		const token = await randomBytes(24).toString('hex');
		return token;
	}

	async forgetToken(user: any): Promise<string> {
		const payload = { email: user.email, sub: user._id };
		const forgetToken = this.jwtService.sign(payload);
		return forgetToken;
	}

	async verifyToken(forgetToken: string): Promise<string> {
		const forgetTokenUser = this.jwtService.verify(forgetToken);
		return forgetTokenUser;
	}

	async verifyAccount(activationToken: string): Promise<string> {
		const validateAccountUser = this.jwtService.verify(activationToken);
		return validateAccountUser;
	}

}
