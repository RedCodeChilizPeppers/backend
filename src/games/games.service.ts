import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateGameDto } from './dto/create-games.dto';
import { UpdateGameDto } from './dto/update-games.dto';
import { Game, GameDocument } from './schemas/games.schema';

@Injectable()
export class GamesService {
	constructor(
		@InjectModel(Game.name) private gameModel: Model<GameDocument>,
	) {}
	async create(createGameDto: CreateGameDto) {
		const createGame = await this.gameModel.create(createGameDto);
		return createGame;
	}

	findAll() {
		return this.gameModel.find();
	}

	findOne(id: string) {
		return this.gameModel.findOne({ _id: id }).exec();
	}

	async update(id: string, updateGameDto: UpdateGameDto) {
		const updateGame = await this.gameModel.findOneAndUpdate(
			{ _id: id },
			updateGameDto,
		);
		return updateGame;
	}

	async remove(id: string) {
		const deleteGame = await this.gameModel
			.findOneAndDelete({ _id: id })
			.exec();
		return deleteGame;
	}
}
