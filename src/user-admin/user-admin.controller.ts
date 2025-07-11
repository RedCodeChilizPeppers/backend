import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { UserAdminService } from './user-admin.service';
import { CreateUserAdminDto } from './dto/create-user-admin.dto';
import { UpdateUserAdminDto } from './dto/update-user-admin.dto';
import { Public } from 'src/decorators/public.decorator';

@Controller('user-admin')
export class UserAdminController {
	constructor(private readonly userAdminService: UserAdminService) {}

	@Post('create')
	create(@Body() createUserAdminDto: CreateUserAdminDto) {
		return this.userAdminService.create(createUserAdminDto);
	}

	@Get('all')
	findAll() {
		return this.userAdminService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.userAdminService.findOne(id);
	}

	@Patch('update/:id')
	update(
		@Param('id') id: string,
		@Body() updateUserAdminDto: UpdateUserAdminDto,
	) {
		return this.userAdminService.update(id, updateUserAdminDto);
	}

	@Delete('delete/:id')
	remove(@Param('id') id: string) {
		return this.userAdminService.remove(id);
	}
}
