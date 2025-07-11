import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
} from '@nestjs/common';
import { Public } from 'src/decorators/public.decorator';
import { CreateGameDto } from './dto/create-games.dto';
import { UpdateGameDto } from './dto/update-games.dto';
import { GamesService } from './games.service';

@Controller('games')
export class GamesController {
	constructor(private readonly gamesService: GamesService) {}

	@Post('create')
	create(@Body() createGameDto: CreateGameDto) {
		return this.gamesService.create(createGameDto);
	}
	@Public()
	@Get('all')
	findAll() {
		return this.gamesService.findAll();
	}

	@Public()
	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.gamesService.findOne(id);
	}

	@Patch('update/:id')
	update(@Param('id') id: string, @Body() updateGameDto: UpdateGameDto) {
		return this.gamesService.update(id, updateGameDto);
	}

	@Delete('delete/:id')
	remove(@Param('id') id: string) {
		return this.gamesService.remove(id);
	}
}
