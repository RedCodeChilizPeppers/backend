import { Controller, Request, UseGuards, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { Public } from './decorators/public.decorator';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) {}

	@UseGuards(JwtAuthGuard)
	@Get('profile')
	getProfile(@Request() req) {
		return req.user;
	}
	@Public()
	@Get()
	getHello(): string {
		return this.appService.getHello();
	}
}
