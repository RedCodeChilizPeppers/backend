import { MailerService } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import {
	Controller,
	Request,
	Post,
	UseGuards,
	Body,
	Get,
	Param,
	Patch,
	BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import path from 'path';
import { Public } from 'src/decorators/public.decorator';
import { MailersService } from 'src/mailer/mailers.service';
import { CreateUserAdminDto } from 'src/user-admin/dto/create-user-admin.dto';
import { UserAdmin } from 'src/user-admin/schemas/user-admin.schema';
import { UserAdminService } from 'src/user-admin/user-admin.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { User } from 'src/user/schemas/user.schema';
import { UserService } from 'src/user/user.service';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
// import { LocalAdminAuthGuard } from './guards/local-admin-auth.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';

@Controller('auth')
export class AuthController {
	constructor(
		private authService: AuthService,
		private userService: UserService,
		private userAdminService: UserAdminService,
		private mailersService: MailersService,
	) {}

	@Public()
	@UseGuards(LocalAuthGuard)
	@Post('login')
	async login(@Request() req) {
		console.log('login');
		return this.authService.login(req.user);
	}

	@Public()
	@UseGuards(AuthGuard('local-admin'))
	@Post('login-admin')
	async loginAdmin(@Request() req) {
		console.log('login-admin');

		return this.authService.loginAdmin(req.user);
	}

	@Public()
	@Post('register')
	async create(@Body() createUserDto: CreateUserDto): Promise<User | string> {
		const userRef = await this.userService.findOneByAffiliate(
			createUserDto.affiliateCode,
		);

		if (userRef) {
			createUserDto = {
				...createUserDto,
				password: await this.authService.hash(createUserDto.password),
				affiliateCode: this.authService.generateAffiliateCode(),
				activationToken: await this.authService.token(),
				referral: userRef,
				language: createUserDto.language,
				nickname: createUserDto.nickname,
			};
		} else {
			createUserDto = {
				...createUserDto,
				password: await this.authService.hash(createUserDto.password),
				affiliateCode: this.authService.generateAffiliateCode(),
				activationToken: await this.authService.token(),
				language: createUserDto.language,
				nickname: createUserDto.nickname,
			};
		}

		const template = '/welcome' + createUserDto.language;
		const context = {
			nickname: createUserDto.nickname,
			link:
				process.env.BASEURL +
				'/verify-account/' +
				createUserDto.activationToken,
		};
		console.log('context: ', context);

		let subjectEmail = '';
		switch (createUserDto.language) {
			case 'fr_FR':
				subjectEmail =
					'Confirmez votre compte Lootingg ' +
					createUserDto.nickname +
					' 🕹';
				break;
			default:
				subjectEmail =
					"Confirm your Lootingg's account " +
					createUserDto.nickname +
					' 🕹';
				break;
		}
		
		this.mailersService.sendMail(
			createUserDto.email,
			subjectEmail,
			template,
			context,
		);

		return await this.userService.create(createUserDto);
	}
	@Public()
	@Post('register-admin')
	async createAdmin(
		@Body() createUserAdminDto: CreateUserAdminDto,
	): Promise<UserAdmin | string> {
		createUserAdminDto = {
			...createUserAdminDto,
			password: await this.authService.hash(createUserAdminDto.password),
		};

		return await this.userAdminService.create(createUserAdminDto);
	}

	// Fonction pour changer le mot de passe quand un utilisateur est connecté
	@UseGuards(JwtAuthGuard)
	@Get('reset-pwd/:id')
	async resetPwd(@Param('id') id: string) {
		// after change pas 2FA
		const user = await this.userService.findOneById(id);
		if (!user) return null;
		let subjectEmail = '';
		switch (user.language) {
			case 'fr_FR':
				subjectEmail =
					'Changer votre mot de passe Lootingg ' + user.nickname;
				break;
			default:
				subjectEmail =
					'Change your password on looting ' + user.nickname;
				break;
		}

		// @TODO : Créer un token pour l'user et le remplacer ici
		const token = 'replacebyjwt';
		const link = 'https://preprod.lootin.gg/change-password/' + token;
		const context = {
			username: user.nickname,
			link: link,
		};
		const template = '/PasswordChange' + user.language;
		return this.mailersService.sendMail(
			user.email,
			subjectEmail,
			template,
			context,
		);
	}

	@Public()
	@Get('verify-jwt/:forgetToken')
	async verifyToken(@Param('forgetToken') forgetToken: string) {
		const checkToken = await this.authService.verifyToken(forgetToken);
		return checkToken;
	}

	@Public()
	@Get('verify-account/:activationToken')
	async verifyAccount(@Param('activationToken') activationToken: string) {
		const user = await this.userService.findOneByActivation(
			activationToken,
		);
		if (!user) return null;
	}

	// Fonction pour réinitialiser le mot de passe quand un utilisateur l'a perdu
	@Public()
	@Get('lost-pwd/:email')
	async lostPwd(@Param('email') email: string) {
		const user = await this.userService.findOneByEmail(email);
		if (!user) return null;

		if (user.forgetToken != undefined || user.forgetToken == ' ') {
			// Si il en a un, on test si il est valide
			console.log('un token existe', user.forgetToken);
			const checkToken = await this.authService.verifyToken(
				user.forgetToken,
			);
			return checkToken;
		} else {
			// Si il en a pas, on lui en créer un, et on envoie un email
			console.log('Aucun token existe');
			const forgetToken = await this.authService.forgetToken(user);
			const setToken = await this.userService.setForgetToken(
				forgetToken,
				user.email,
			);

			let subjectEmail = '';
			const link =
				process.env.BASEURL + '/change-password/' + forgetToken;
			const context = {
				username: user.nickname,
				link: link,
			};

			switch (user.language) {
				case 'fr_FR':
					subjectEmail =
						'Réinitialisez votre mot de passe Lootingg ' +
						user.nickname;
					break;
				default:
					subjectEmail =
						'Reset your password on looting ' + user.nickname;
					break;
			}
			const template = '/PasswordChange' + user.language;
			return this.mailersService.sendMail(
				user.email,
				subjectEmail,
				template,
				context,
			);
		}
	}

	@Public()
	@Patch('updatepw/:id')
	async updateUserPw(
		@Param('id') id: string,
		@Body() updateUserDto: UpdateUserDto,
	) {
		console.log("ici c'est:", updateUserDto.forgetToken);
		try {
			await this.authService.verifyToken(updateUserDto.forgetToken);
			const user = await this.userService.findOneByForgetToken(
				updateUserDto.forgetToken,
			);
			if (!user)
				throw new BadRequestException({
					cause: `Token not found`,
					description: 'Token not found',
				});
			console.log('on résuutis');
			return this.userService.updatePw(id, updateUserDto);
		} catch (error) {
			console.log('error', error);
			return error;
		}
	}
}
