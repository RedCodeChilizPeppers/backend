import { PartialType } from '@nestjs/swagger';
import { IsDate } from 'class-validator';
import { CreateNotificationDto } from './create-notification.dto';

export class UpdateNotificationDto extends PartialType(CreateNotificationDto) {
	@IsDate()
	datePush: Date;
}
