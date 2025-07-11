import {
	Logger,
	Controller,
	Post,
	Body,
	Headers,
	BadRequestException,
	RawBodyRequest,
	Req,
	Get,
} from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';
import { Public } from 'src/decorators/public.decorator';
import { PaymentService } from './payment.service';
import Stripe from 'stripe';
import { TransactionService } from 'src/transaction/transaction.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import mongoose, { Types } from 'mongoose';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/schemas/user.schema';
import { TalentsService } from 'src/talents/talent.service';
import { Talent } from 'src/talents/schemas/talent.schema';
import { RawBody } from 'src/decorators/raw-body.decorator';
import { OrderbookService } from 'src/orderbook/orderbook.service';
import * as moment from 'moment';
import { Transaction } from 'src/transaction/schemas/transaction.schema';
import { features } from 'process';
import { MailersService } from 'src/mailer/mailers.service';
import fetch from 'node-fetch';

@Controller('payment')
export class PaymentController {
	private readonly logger = new Logger(PaymentController.name);
	subscriptionService: any;

	constructor(
		private readonly mailersService: MailersService,
		private readonly paymentService: PaymentService,
		private readonly transactionService: TransactionService,
		private readonly notificationsService: NotificationsService,
		private readonly userService: UserService,
		private readonly talentService: TalentsService,
		private readonly orderbookService: OrderbookService,
	) {}

	@Post('createnotifdiscord')
	createNotifDiscord(@Body() mountant: number) {
		return this.paymentService.createNotifDiscord(mountant);
	}
	
	@Public()
	@Post('webhookdeposit')
	async webhookDepositStripe(@Headers() headers, @RawBody() rawBody) {
		const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
			apiVersion: '2022-08-01',
		});
		const endpointSecret = process.env.STRIPE_ENDPOINT_DEPOSIT_SECRET;
		const sig = headers['stripe-signature'];
		this.logger.log(`sig => ${sig}`);
		let event;
		try {
			event = stripe.webhooks.constructEvent(
				rawBody,
				sig,
				endpointSecret,
			);
		} catch (err) {
			throw new BadRequestException({
				cause: `Bad Signature`,
				description: err.message,
			});
		}
		// Handle the checkout.session.completed event
		if (event.type === 'checkout.session.completed') {
			const session = event.data.object;
			
			switch (session.payment_status) {
				case 'paid':

				await this.transactionService.create({
					talentId: "Deposit",
					to: session.client_reference_id,
					os: "stripe_deposit",
					currency: session.currency,
					price: session.amount_total / 100,
					status: "paid",
					product: "deposit",
					quantity: 1,
					fees: 0,
					transacId: session.id,
				});

				const mountant = session.amount_total / 100;

				const user = await this.userService.findOneWithId(session.client_reference_id);
				const newBalance = user.balanceAvailable + (session.amount_total / 100);
				const data = { balanceAvailable: newBalance };
				await this.userService.update(session.client_reference_id, data);
				await this.paymentService.createNotifDiscord(mountant);
			}
		}
		return true;
	}

	@Public()
	@Post('webhook')
	async webhookStripe(@Headers() headers, @RawBody() rawBody) {
		const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
			apiVersion: '2022-08-01',
		});
		// If you are testing your webhook locally with the Stripe CLI you
		// can find the endpoint's secret by running `stripe listen`
		// Otherwise, find your endpoint's secret in your webhook settings in the Developer Dashboard
		const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
		const sig = headers['stripe-signature'];
		this.logger.log(`sig => ${sig}`);
		// const event = rawBody;
		// console.log(rawBody);
		// return true;
		let event;
		try {
			event = stripe.webhooks.constructEvent(
				rawBody,
				sig,
				endpointSecret,
			);
		} catch (err) {
			throw new BadRequestException({
				cause: `Bad Signature`,
				description: err.message,
			});
		}
		// Handle the checkout.session.completed event
		if (event.type === 'checkout.session.completed') {
			const session = event.data.object;
			const transaction = await this.transactionService.findOne(
				session.client_reference_id,
			);
			// console.log('transaction', transaction);
			const buyer = await this.userService.findOneById(transaction.to);

			const talent = await this.talentService.findOne(
				transaction.talentId,
			);
			switch (session.payment_status) {
				case 'paid':
					await this.transactionService.update(
						session.client_reference_id,
						Object.assign(transaction, {
							status: 'paid',
						}),
					);

					if (transaction.from[0] != '') {
						// let hasToken = false;
						let sellers: User[];
						if (!moment().isBefore(talent.publicSale)) {
							for (const sellerId in transaction.from) {
								const seller =
									await this.userService.findOneById(
										sellerId,
									);
								const orders =
									await this.orderbookService.findAllWithFilter(
										{
											userId: sellerId,
											transactionId:
												transaction._id.string(),
											txLocked: true,
										},
									);
								for (const order of orders) {
									await this.deleteToPortfolio(
										seller,
										talent,
										order.numberToken,
									);
									await this.transferAmountToWalletSeller(
										order.price * order.numberToken,
										seller,
									);
									await this.orderbookService.update(
										order._id,
										{
											status: 'selled',
										},
									);
								}
							}
						}
						await this.addInPortfolio(
							buyer,
							talent,
							transaction.quantity,
						);
					}

					
					this.notificationsService.create({
						from: 0,
						to: buyer,
						title: 'LTT_receive',
						body: 'buy_LTT',
						read: false,
						enabled: true,
						link: '',
					});

					// On met a jour le nombre de participants
					const numberParticipant = await this.userService.findAllByTalent(talent._id.toString());
					const NewNumberParticipant = numberParticipant + 1;
					const updateParticipant = this.talentService.updateNumberParticipant(talent._id.toString(), NewNumberParticipant);
					updateParticipant;
					
					// On met a jour le nombre de LTT restant
					let lttLeft = 0;
					const lttBuy = await this.userService.countAmountByTalent(talent._id.toString());
					if (moment(talent.publicSale).isBefore(moment()) ) {
						// Si c'est en public sale :
						lttLeft = (talent.publicSaleMax - lttBuy);
					} else {
						// Si c'est en private sale :
						lttLeft = (talent.privateSaleMax - lttBuy);
					}
				
					this.deleteToPortfolio = async (seller: User, talent, quantity: number) => {
						for (const folio of seller.portfolioTalent as {
							_id: mongoose.Schema.Types.ObjectId;
							amount: number;
							talent: Talent;
						}[]) {
							if (folio?.talent?._id.toString() === talent._id.toString()) {
								if (folio.amount) {
									folio.amount = folio.amount - quantity;
									this.userService.updatePortfolio(
										seller._id.toString(),
										folio._id.toString(),
										{
											portfolioTalent: {
												amount: folio.amount,
												talent: folio.talent._id,
											},
										},
									);
								}
							}
						}
					};
				
					this.addInPortfolio = async (buyer: User, talent: Talent, quantity: number) => {
						let hasToken = false;
				
						for (const folio of buyer.portfolioTalent as {
							_id: mongoose.Schema.Types.ObjectId;
							amount: number;
							talent: Talent;
						}[]) {
							if (folio?.talent?._id.toString() === talent._id.toString()) {
								if (folio.amount) {
									folio.amount = folio.amount + quantity;
								} else {
									folio.amount = quantity;
								}
								this.userService.updatePortfolio(
									buyer._id.toString(),
									folio._id.toString(),
									{
										portfolioTalent: {
											amount: folio.amount,
											talent: folio.talent._id,
										},
									},
								);
								hasToken = true;
							}
						}
						if (!hasToken) {
							this.userService.newPortfolio(buyer._id.toString(), {
								portfolioTalent: {
									amount: quantity,
									talent: talent._id,
								},
							});
						}
					};
					this.transferAmountToWalletBuyer = async (
						balanceTransfert: number,
						buyer: User,
					) => {
						try {
							const newBalanceBuyer = buyer.balanceAvailable - balanceTransfert;
							await this.userService.update(buyer._id.toString(), {
								balanceAvailable: newBalanceBuyer,
							});
						} catch (error) {
							this.logger.debug(
								`PaymentController transferAmountToWallet:  ${error}`,
							);
						}
					};
					this.transferAmountToWalletSeller = async (
						balanceTransfert: number,
						seller: User,
					) => {
						try {
							const newBalanceSeller = seller.balanceAvailable + balanceTransfert;
							await this.userService.update(seller._id.toString(), {
								balanceAvailable: newBalanceSeller,
							});
						} catch (error) {
							this.logger.debug(
								`PaymentController transferAmountToWallet:  ${error}`,
							);
						}
					};

					break;
				case 'unpaid':
					await this.transactionService.update(
						session.client_reference_id,
						Object.assign(transaction, {
							status: 'unpaid',
						}),
					);
					if (!moment().isBefore(talent.publicSale)) {
						for (const sellerId in transaction.from) {
							const orders =
								await this.orderbookService.findAllWithFilter({
									userId: sellerId,
									transactionId: transaction._id.string(),
									txLocked: true,
								});
							for (const order of orders) {
								await this.orderbookService.update(order._id, {
									txLocked: false,
								});
							}
						}
					}
					break;
				default:
					break;
			}
		}

		return true;
	}

	@Public()
	@Post('create')
	async create(@Body() body) {
		console.log('body', body);
		if (body.amount <= 0) {
			this.logger.debug(`Payment Controller create: bad amount`);
			throw new BadRequestException({
				cause: `Bad data`,
				description: 'amount not available',
			});
		}
		try {
			let from = [process.env.ID_ADMIN];
			console.log("from admin en haut: ", from);

			const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
				apiVersion: '2022-08-01',
			});
			const talent: Talent = await this.talentService.findOneByNickname(
				body.price_data.product_data.name.split(' ')[0],
			);
			const buyer: User = await this.userService.findOneByEmail(
				body.emailUser,
			);
			const transaction = await this.transactionService.create({
				talentId: talent._id.toString(),
				from: from,
				to: buyer._id.toString(),
				os: "stripe",
				product: "$LTT Purchase",
				currency: convertCurrency[body.price_data.currency],
				quantity: body.quantity,
				fees: body.price_data.fees,
				price: +(
					body.price_data.unit_amount * body.quantity +
					body.price_data.fees
				),
				status: "pending",
				transacId: ""
			});
			if (talent.isSalable == true) {
				const transfers = await this.sellAfterIntro(
					talent,
					buyer,
					transaction,
					false,
				);
				from = transfers.from;
				console.log("talent.isSalable = true: ", from);
			} else {
				const transfers = await this.sellAfterIntro(
					talent,
					buyer,
					transaction,
					false,
				);
				from = [process.env.ID_ADMIN];
				console.log("talent.isSalable = false ", from);
			}
			// if (!moment().isBefore(talent.publicSale)) {
			// 	console.log("je suis ici");
				
			// 	const transfers = await this.sellAfterIntro(
			// 		talent,
			// 		buyer,
			// 		transaction,
			// 		false,
			// 	);
			// 	from = transfers.from;
			// 	console.log("from !moment().isBefore(talent.publicSale): ", from);
			// }
			if (
				(moment().isBefore(talent.publicSale) &&
					from.length === 1 &&
					from[0] == process.env.ID_ADMIN &&
					talent.price == body.price_data.unit_amount) ||
				!moment().isBefore(talent.publicSale)
			) {
				const price = Math.round(
					parseFloat(body.price_data.unit_amount) * 100 +
						(parseFloat(body.price_data.unit_amount) * 100 * 5) /
							100,
				);

				const session = await stripe.checkout.sessions.create({
					customer_email: body.emailUser,
					line_items: [
						{
							price_data: {
								currency: body.price_data.currency
									? convertCurrency[body.price_data.currency]
									: 'eur',
								product_data: {
									name: body.price_data.product_data.name,
								},
								unit_amount: price,
							},
							quantity: body.quantity,
						},
					],
					mode: 'payment',
					client_reference_id: transaction._id.toString(),
					success_url: `https://preprod.lootin.gg/user/wallet?success=true`,
					cancel_url: `https://preprod.lootin.gg/payment/canceled`,
				});

				this.transactionService.update(transaction._id, {
					transacId: session.id,
					os: 'stripe',
					product: body.price_data.product_data.name,
					renew: false,
					autoRenew: false,
					receipt: '',
					status: 'pending',
				});
				console.log('session.url', session.url);
				return session.url;
			}
		} catch (error) {
			this.logger.debug(`Payment Controller :  ${error}`);
		}
	}
	@Public()
	@Post('wallet/create')
	async wallet(@Body() body) {
		console.log('body wallet/create: ', body);
		if (body.amount <= 0) {
			this.logger.debug(`Payment Controller wallet/create: bad amount`);
			throw new BadRequestException({
				cause: `Bad data`,
				description: 'amount not available',
			});
			// Il faut retourner une erreur
		}
		try {

			let from = [];
			const talent: Talent = await this.talentService.findOneByNickname(
				body.price_data.product_data.name.split(' ')[0],
			);

			const buyer: User = await this.userService.findOneByEmail(
				body.emailUser,
			);
			

			if (body.price_data.unit_amount > buyer.balanceAvailable) {
				console.log("erreur au niveau du paiement");
				
				return new BadRequestException({
					cause: `Bad data`,
					description: 'insufficient balance',
				});
			}
			
			const sumSold = await this.transactionService.findSumLttSold(talent._id.toString());
			
			this.notificationsService.create({
				from: 0,
				to: buyer,
				title: 'LTT_receive',
				body: 'buy_LTT',
				read: false,
				enabled: true,
				link: '',
			});

			// console.log('sumSold', sumSold);
			// const today = moment();
			const transaction = await this.transactionService.create({
				talentId: talent._id.toString(),
				to: buyer._id.toString(),
				currency: convertCurrency[body.price_data.currency],
				quantity: body.quantity,
				os: "wallet",
				fees: body.price_data.fees,
				price: +(
					body.price_data.unit_amount
				),
				product: "$LTT Purchase",
				status: "pending",
				transacId: ""
			});

			// console.log('la transaction quon créer dans la db ', transaction);

			// On met a jour le nombre de participants
			const numberParticipant = await this.userService.findAllByTalent(talent._id.toString());
			const NewNumberParticipant = numberParticipant + 1;
			const updateParticipant = this.talentService.updateNumberParticipant(talent._id.toString(), NewNumberParticipant);
			updateParticipant;
			
			// On met a jour le nombre de LTT restant
			let lttLeft = 0;
			const lttBuy = await this.userService.countAmountByTalent(talent._id.toString());
			// console.log("il y a actuellement", lttBuy, " $LTT achetés par des utilisateurs");

			// console.log("transaction.price", transaction.price);
			
			
			if (!talent.isSalable) {
				// console.log("private sale");
				// Si c'est en private sale :
				lttLeft = (talent.privateSaleMax - lttBuy);
				// console.log("lttLeft resultat:", lttLeft);
				const updateLTTLeft = this.talentService.updateLTTLeft(talent._id.toString(), lttLeft);
				updateLTTLeft;
				
			} else {
				// console.log("public sale");
				// Si c'est en public sale :
				lttLeft = (talent.totalSupply - lttBuy);
				// console.log("lttLeft resultat:", lttLeft);
				const updateLTTLeft = this.talentService.updateLTTLeft(talent._id.toString(), lttLeft);
				updateLTTLeft;
			}

			// Pour vérifier que c'est pas vide
			const totalSoldLtt = 0;
			if (sumSold) {
				// console.log("on implemente ici sumsold");
				const totalSoldLtt = 0;
			} else {
				// console.log("pas besoin on rentre dans le esle de TotalSoldLTT");
				const totalSoldLtt = sumSold[0].totalSold;
			}
			// Si vente privée :
			if (talent.isSalable == false) {
				const authorizedToBeSold = talent.privateSaleMax;
				// console.log("Vente privée -> On peut vendre ", authorizedToBeSold);
				// console.log("Vente privée -> Il reste ", lttLeft);
				// console.log("Vente privée -> Est-ce que il reste assez de token a vendre ", body.quantity < authorizedToBeSold - lttLeft);
				

				if (body.quantity < authorizedToBeSold - lttLeft) {
					await this.addInPortfolio(buyer, talent, body.quantity);
					const lootinSeller = await this.userService.findOneById(
						process.env.ID_ADMIN,
					);
					
					// On retire l'argent de l'acheteur
					await this.transferAmountToWalletBuyer(
						transaction.price,
						buyer,
					);
					// On transfert l'argent de l'acheteur au vendeur
					await this.transferAmountToWalletSeller(
						transaction.price,
						lootinSeller,
					);
				}
			// Si vente publique ouverte et qu'il n'y a pas d'ordre de vente en cours -> On créer un orderbook en tant que lootingg
			// Si il n'y a pas d'ordre de vente, on vend en tant que lootingg
			} else {
				const transfers = await this.sellAfterIntro(
					talent,
					buyer,
					transaction,
					true,
				);
				// console.log("le buyer est", buyer.email);
				// console.log("la transaction est", transaction);
				// console.log("transaction.price est ", transaction.price);
				from = transfers.from;
				if (!from || from.length === 0) {
					// console.log("on vend en tant qu'admin");
					from = [process.env.ID_ADMIN];
					
					const lootinSeller = await this.userService.findOneById(
						process.env.ID_ADMIN,
					);
					await this.transferAmountToWalletSeller(
						transaction.price,
						lootinSeller,
					);
				}
				// console.log("Vente publique de :", from);

			}

			// const fee =
			// 	(parseFloat(body.price_data.unit_amount) * 100 * 5) / 100;
			// const price = parseFloat(body.price_data.unit_amount) * 100 + fee;
			const transfertByWallet = await this.transactionService.update(
				transaction._id,
				{
					transacId: uuidv4(),
					os: 'wallet',
					from: from,
					product: body.price_data.product_data.name,
					renew: false,
					autoRenew: false,
					receipt: '',
					status: 'paid',
				},
			);
		} catch (error) {
			this.logger.debug(`PaymentController wallet:  ${error}`);
		}
	}
	sellAfterIntro = async (
		talent: Talent,
		buyer: User,
		transaction: Transaction,
		withWallet: boolean,
	): Promise<{ from: string[] }> => {
		let sumSelected = 0;
		const from = [];
		// console.log("juste pour savoir ici", from);
		
		const fee = transaction.fees;
		const price = transaction.price;
		// authorizedToBeSold - sumSold[0] == 0
		// 	? (from = [])
		// 	: (sumSelected =
		// 			(authorizedToBeSold - sumSold[0]) *
		// 			parseFloat(talent.price));

		// const diff = body.quantiy - authorizedToBeSold - sumSold[0];
		// console.log("ce que veux l'acheteur: ", transaction);

		const quantityBuy = transaction.quantity;
		
		const orders = await this.orderbookService.findAllByTalentId(
			talent._id.toString(),
			transaction.quantity,
			{
				txLocked: { $ne: true },
				status: 'pending',
				userId: { $ne: buyer._id.toString() },
			},
		);
		// console.log('orders', orders);
		// console.log("l'acheteur veux en quantité :", transaction.quantity);
		const orderSelect = orders.filter((order) => {
			// console.log("order :", order);
			// console.log("sumSelected :", sumSelected);
			// console.log("Dans cet order on prend :", order.numberToken);
			
			if (order.price + sumSelected <= price - fee) {
				sumSelected += order.price * order.numberToken;
				// console.log("order dans le if", order);
				return order;
			}
		});
		// console.log('orderSelect', orderSelect);
		let amountTransfer = 0;

		let remainingTokensToBuy = transaction.quantity;
		// console.log("test de remainingTokensToBuy: ", remainingTokensToBuy);
		

for (let i = 0; i < orderSelect.length; i++) {
	const order = orderSelect[i];
	const seller = await this.userService.findOneById(order.userId);
	
	
	if (withWallet) {
		let quantityToSell = Math.min(remainingTokensToBuy, order.numberToken);
        remainingTokensToBuy -= quantityToSell;

        await this.deleteToPortfolio(seller, talent, quantityToSell);

        const remainingTokensToSell = order.numberToken - quantityToSell;
		
		if (remainingTokensToSell  <= 0) {
			// L'ordre a été entièrement vendu, on met à jour le statut de l'order book
			// console.log("on arrive ici OKLM");
			
			await this.orderbookService.update(order._id, {
				status: 'selled',
				numberToken: quantityToSell,
			});

			// TODO ICI ENVOYER LE MAIL ET CREER LA TRANSACTION
			
		// Il faut créer une transaction pour la vente des tokens
		const transactionSeller = await this.transactionService.create({
			talentId: talent._id.toString(),
			to: seller._id.toString(),
			currency: order.currency,
			quantity: quantityToSell,
			os: "wallet",
			fees: 0,
			price: +(
				order.price * quantityToSell
				// transaction.price - transaction.fees
			),
			product: "LTT_Sell",
			status: "selled",
			transacId: uuidv4()
		});
		// console.log("on execute transactionSeller", transactionSeller);

		// Ici il faut envoyer un email lorsqu'un token a été vendu
		const template = '/sellToken' + seller.language;
		const context = {
			username: seller.nickname,
			talentName: talent.nickname,
			numberToken: quantityToSell
		};

		let subjectEmail = '';
		switch (seller.language) {
			case 'fr-FR':
				subjectEmail =
					'Félicitation ' +
					seller.nickname +
					' vous avez vendu vos $LTTs !';
				break;
			default:
				subjectEmail =
					'Congratulations ' +
					seller.nickname +
					' you selled your $LTTs!';
				break;
		}

		this.mailersService.sendMail(
			seller.email,
			subjectEmail,
			template,
			context,
		);
		// console.log("on envoie un email a ", seller.nickname);

		// On envoie à l'acheteur aussi
		const templateBuyer = '/buyToken' + buyer.language;
		const contextBuyer = {
			username: buyer.nickname,
			talentName: talent.nickname,
			numberToken: transaction.quantity
		};

		let subjectEmailBuyer = '';
		switch (buyer.language) {
			case 'fr-FR':
				subjectEmailBuyer =
					'Félicitation ' +
					buyer.nickname +
					' vous avez reçu vos $LTTs !';
				break;
			default:
				subjectEmailBuyer =
					'Congratulations ' +
					buyer.nickname +
					' you have received your $LTTs!';
				break;
		}

		this.mailersService.sendMail(
			buyer.email,
			subjectEmailBuyer,
			templateBuyer,
			contextBuyer,
		);
		// console.log("on envoie un email aussi a ", buyer.nickname);
		

		} else {
			// On met à jour le statut de l'ordre actuel pour indiquer qu'il a été partiellement vendu
			await this.orderbookService.update(order._id, {
				numberToken: quantityToSell,
				status: 'selled',
			});
	
			// Une partie seulement de l'ordre a été vendue, on crée un nouvel ordre avec le reste
			// console.log("on arrive ici aussi pepere");
			// console.log("orderSelect du buyer, ", orderSelect);
			// console.log("order partiellement vendu , ", order);

			// console.log("a soustraire c'est: ", LttSellRestant, "-", transaction.quantity, " = ", LttSellRestant - transaction.quantity);
			
			// console.log("LttSellRestant orderbook seller: ", LttSellRestant);
			
			
			const formData = {
				userId: order.userId,
				talent: talent,
				method: "sell",
				price: order.price,
				// C'est ici qu'il y a un probleme 
				numberToken: remainingTokensToSell,
				currency: order.currency,
				status: "pending",
			};
			const res = await this.orderbookService.create(formData);
			// console.log("reponse de la create order book", res);

			
		// Il faut créer une transaction pour la vente des tokens
		const transactionSeller = await this.transactionService.create({
			talentId: talent._id.toString(),
			to: seller._id.toString(),
			currency: order.currency,
			// C'est ici qu'il y a un probleme 
			quantity: quantityToSell,
			os: "wallet",
			fees: 0,
			price: +(
				order.price * quantityToSell
				// transaction.price - transaction.fees
			),
			product: "LTT_Sell",
			status: "selled",
			transacId: uuidv4()
		});
		// console.log("on execute transactionSeller", transactionSeller);

		// Ici il faut envoyer un email lorsqu'un token a été vendu
		const template = '/sellToken' + seller.language;
		const context = {
			username: seller.nickname,
			talentName: talent.nickname,
			numberToken: quantityToSell
		};

		let subjectEmail = '';
		switch (seller.language) {
			case 'fr-FR':
				subjectEmail =
					'Félicitation ' +
					seller.nickname +
					' vous avez vendu vos $LTTs !';
				break;
			default:
				subjectEmail =
					'Congratulations ' +
					seller.nickname +
					' you selled your $LTTs!';
				break;
		}

		this.mailersService.sendMail(
			seller.email,
			subjectEmail,
			template,
			context,
		);
		// console.log("on envoie un email a ", seller.nickname);

		// On envoie à l'acheteur aussi
		const templateBuyer = '/buyToken' + buyer.language;
		const contextBuyer = {
			username: buyer.nickname,
			talentName: talent.nickname,
			numberToken: transaction.quantity
		};

		let subjectEmailBuyer = '';
		switch (buyer.language) {
			case 'fr-FR':
				subjectEmailBuyer =
					'Félicitation ' +
					buyer.nickname +
					' vous avez reçu vos $LTTs !';
				break;
			default:
				subjectEmailBuyer =
					'Congratulations ' +
					buyer.nickname +
					' you have received your $LTTs!';
				break;
		}

		this.mailersService.sendMail(
			buyer.email,
			subjectEmailBuyer,
			templateBuyer,
			contextBuyer,
		);
		// console.log("on envoie un email aussi a ", buyer.nickname);
	
		}

		const amountDue = order.price * quantityToSell;
		await this.transferAmountToWalletSeller(amountDue, seller);

		amountTransfer += amountDue;
		quantityToSell -= quantityToSell;

		// console.log(`on a transféré un total de: ${amountTransfer}`);

	} else {
			console.log("order transféré", order);
			await this.orderbookService.update(order._id, {
				txLocked: true,
				transactionId: transaction._id.toString(),
			});
		}

		from.push(order.userId);

		// console.log("le buyer vend", order);
		// console.log("il faut que le buyer vend ", transaction.quantity);

		// console.log("orderSelect ici ", orderSelect);
		

		this.notificationsService.create({
			from: 0,
			to: seller,
			title: 'LTT_sell',
			body: 'LTT_has_been_sell',
			read: false,
			enabled: true,
			link: '',
		});

	}
	
		if (withWallet) {
			const lootinSeller = await this.userService.findOneById(
				process.env.ID_ADMIN,
			);
			amountTransfer += fee;
			await this.addInPortfolio(buyer, talent, transaction.quantity);
			await this.transferAmountToWalletBuyer(amountTransfer, buyer);
			await this.transferAmountToWalletSeller(fee, lootinSeller);
		}
		return { from: [...new Set(from)] };
	};

	deleteToPortfolio = async (seller: User, talent, quantity: number) => {
		
		for (const folio of seller.portfolioTalent as {
			_id: mongoose.Schema.Types.ObjectId;
			amount: number;
			talent: Talent;
		}[]) {
			if (folio?.talent?._id.toString() === talent._id.toString()) {
				if (folio.amount) {
					folio.amount = folio.amount - quantity;
					this.userService.updatePortfolio(
						seller._id.toString(),
						folio._id.toString(),
						{
							portfolioTalent: {
								amount: folio.amount,
								talent: folio.talent._id,
							},
						},
					);
				}
			}
		}
	};

	addInPortfolio = async (buyer: User, talent: Talent, quantity: number) => {
		let hasToken = false;

		for (const folio of buyer.portfolioTalent as {
			_id: mongoose.Schema.Types.ObjectId;
			amount: number;
			talent: Talent;
		}[]) {
			if (folio?.talent?._id.toString() === talent._id.toString()) {
				if (folio.amount) {
					folio.amount = folio.amount + quantity;
				} else {
					folio.amount = quantity;
				}
				this.userService.updatePortfolio(
					buyer._id.toString(),
					folio._id.toString(),
					{
						portfolioTalent: {
							amount: folio.amount,
							talent: folio.talent._id,
						},
					},
				);
				hasToken = true;
			}
		}
		if (!hasToken) {
			this.userService.newPortfolio(buyer._id.toString(), {
				portfolioTalent: {
					amount: quantity,
					talent: talent._id,
				},
			});
		}
	};
	transferAmountToWalletBuyer = async (
		balanceTransfert: number,
		buyer: User,
	) => {
		try {
			const newBalanceBuyer = buyer.balanceAvailable - balanceTransfert;
			await this.userService.update(buyer._id.toString(), {
				balanceAvailable: newBalanceBuyer,
			});
			console.log("on a enlevé", balanceTransfert, "€ a ", buyer.nickname, " ce qui lui fait un total de ", newBalanceBuyer);
		} catch (error) {
			this.logger.debug(
				`PaymentController transferAmountToWallet:  ${error}`,
			);
		}
	};
	transferAmountToWalletSeller = async (
		balanceTransfert: number,
		seller: User,
	) => {
		try {
			const newBalanceSeller = seller.balanceAvailable + balanceTransfert;
			await this.userService.update(seller._id.toString(), {
				balanceAvailable: newBalanceSeller,
			});
			console.log("on a transféré", balanceTransfert, "€ a ", seller.nickname, " ce qui lui fait un total de ", newBalanceSeller);
			
		} catch (error) {
			this.logger.debug(
				`PaymentController transferAmountToWallet:  ${error}`,
			);
		}
	};
}

const convertCurrency = {
	'€': 'eur',
	$: 'usd',
};

