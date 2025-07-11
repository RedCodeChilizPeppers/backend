import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { UpdateNotificationDto } from './dto/update-notification.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Public } from 'src/decorators/public.decorator';

@Controller('notifications')
export class NotificationsController {
	constructor(private readonly notificationsService: NotificationsService) {}

	@Post('create')
	create(@Body() createNotificationDto: CreateNotificationDto) {
		return this.notificationsService.create(createNotificationDto);
	}

	@Get('all')
	findAll() {
		return this.notificationsService.findAll();
	}

	@UseGuards(JwtAuthGuard)
	@Get('all/:id')
	findAllByUser(@Param('id') id: string) {
		return this.notificationsService.findAllByUser(id);
	}

	@UseGuards(JwtAuthGuard)
	@Get('allRead/:id')
	findAllByUserMaxNumber(@Param('id') id: string) {
		return this.notificationsService.findAllByUserMaxNumber(id);
	}

	// @Patch('read/:id')
	// readOneNotif(@Param('id') id: string) {
	// 	console.log("id de la notif est: ", id);
	// 	return this.notificationsService.readOneNotif(id);
	// }

	@Patch('markallread/:id')
	markAllRead(@Param('id') id: string) {
		return this.notificationsService.readAllNotif(id);
	}
	
	@Patch('read/:id')
	readOneNotif(@Param('id') id: string) {
		return this.notificationsService.readOneNotif(id);
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.notificationsService.findOne(id);
	}

	@Patch('update/:id')
	update(
		@Param('id') id: string,
		@Body() updateNotificationDto: UpdateNotificationDto,
	) {
		return this.notificationsService.update(id, updateNotificationDto);
	}

	@Delete('delete/:id')
	remove(@Param('id') id: string) {
		return this.notificationsService.remove(id);
	}
}
