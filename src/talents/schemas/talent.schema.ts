import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Transform } from 'class-transformer';
import mongoose, { Document, ObjectId } from 'mongoose';
import { Categories } from 'src/categories/schemas/categories.schema';
import { Game } from 'src/games/schemas/games.schema';
import { SnapshotBlockchain } from 'src/snapshot-blockchain/entities/snapshot-blockchain.entity';
import { SocialNetwork } from 'src/social-network/entities/social-network.entity';

export type TalentDocument = Talent & Document;

@Schema({ timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } })
export class Talent {
	@Transform(({ value }) => value.toString())
	_id: ObjectId;

	@Prop()
	nickname: string;

	@Prop()
	name: string;

	@Prop()
	surname: string;

	@Prop()
	image: string;

	@Prop()
	birthday: Date;

	@Prop()
	contractLength: number;

	@Prop()
	introductionValue: number;

	@Prop()
	dateIntroduction: Date;

	@Prop()
	privateSale: Date;

	@Prop()
	privateSaleMax: number;

	@Prop()
	publicSale: Date;

	@Prop()
	publicSaleMax: number;

	@Prop()
	totalSupply: number;

	@Prop()
	isSalable: boolean;

	@Prop()
	isBuy: boolean;

	@Prop()
	currency: string;

	@Prop()
	dividends: boolean;

	@Prop()
	price: number;

	@Prop()
	amountDividend: number;

	@Prop()
	snapshotBlockchain: [SnapshotBlockchain];

	@Prop()
	description: string;

	@Prop()
	country: string;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Categories' })
	category: Categories;

	@Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Game' })
	game: Game;

	@Prop()
	social: [SocialNetwork];
}

export const TalentSchema = SchemaFactory.createForClass(Talent);
