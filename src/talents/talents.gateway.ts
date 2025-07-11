import {
	MessageBody,
	SubscribeMessage,
	WebSocketGateway,
	WebSocketServer,
	OnGatewayConnection,
	OnGatewayDisconnect,
	OnGatewayInit,
} from '@nestjs/websockets';
import { TalentsService } from './talent.service';
import * as moment from 'moment';
import { OrderbookService } from 'src/orderbook/orderbook.service';
import { TransactionService } from 'src/transaction/transaction.service';

@WebSocketGateway({
	cors: {
		origin: '*',
	},
})
export class TalentsGateway
	implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit
{
	constructor(
		private readonly talentsService: TalentsService,
		private readonly orderbookService: OrderbookService,
		private readonly transactionService: TransactionService,
	) {}
	@WebSocketServer()
	server: any;

	@SubscribeMessage('handleChangePrice')
async handleChangePrice(
  @MessageBody() data: { talentId: string; quantity: number },
) {
  console.log("SubscribeMessage('handleChangePrice') est: ", data);
  try {
    const talent = await this.talentsService.findOne(data.talentId);
    if (talent.isSalable) {
      console.log('test id');
      const limitBuy = data.quantity;
      const orders = await this.orderbookService.findAllByTalentId(
        talent._id.toString(),
        limitBuy,
        { txLocked: { $ne: true }, status: 'pending' },
      );

      console.log('orders', orders);
      const ordersWithTokens = orders.map((order) => {
        const { price, numberToken } = order;
        return { price, numberToken, totalPrice: price * numberToken };
      });

      console.table(ordersWithTokens, ['price', 'numberToken', 'totalPrice']);

      const totalTokens = ordersWithTokens.reduce(
        (total, order) => total + order.numberToken,
        0,
      );
      console.log('totalTokens', totalTokens);

      let totalPrice = 0;
      let totalQuantity = 0;
      for (let i = 0; i < ordersWithTokens.length; i++) {
        const order = ordersWithTokens[i];
        if (totalQuantity + order.numberToken >= data.quantity) {
          const quantityNeeded = data.quantity - totalQuantity;
          totalPrice += order.price * quantityNeeded;
          break;
        } else {
          totalPrice += order.totalPrice;
          totalQuantity += order.numberToken;
        }
      }

      console.log('totalPrice', totalPrice);

      return { totalPrice, totalTokens };
    } else {
      const totalPrice = talent.price * data.quantity;
      console.log('totalPrice', totalPrice);
      const average = totalPrice / data.quantity;
      return { totalPrice, average, totalTokens: 0 };
    }
  } catch (err) {
    console.log(err);
  }
}

	@SubscribeMessage('generalAverage')
	async generalAverage(@MessageBody() data: { talentId: string }) {
		try {
			const talent = await this.talentsService.findOne(data.talentId);
			if (!moment().isBefore(talent.publicSale)) {
				const count = await this.orderbookService.count({
					talent: data.talentId,
				});
				console.log(count);
				this.server.emit('maxSellableQuantity', { count });
				const minOrder = await this.orderbookService.findAllByTalentId(
					data.talentId,
					1,
					{ txLocked: { $ne: true }, status: 'pending' },
					{
						price: 1,
					},
				);
				const maxOrder = await this.orderbookService.findAllByTalentId(
					data.talentId,
					1,
					{ txLocked: { $ne: true }, status: 'pending' },
					{
						price: -1,
					},
				);
				const average =
					((minOrder[0].price || 0) + (maxOrder[0].price || 0)) /
					(minOrder.length + maxOrder.length);
				return {
					min: minOrder[0].price,
					max: maxOrder[0].price,
					average,
				};
			} else {
				const authorizedToBeSold = talent.totalSupply;
				const sumSold = await this.transactionService.findSumLttSold(
					talent._id.toString(),
				);
				console.log('sumSold', sumSold[0].totalSold);
				this.server.emit('maxSellableQuantity', {
					count: authorizedToBeSold - sumSold[0].totalSold,
				});
				return { average: talent.price };
			}
		} catch (err) {
			console.log('generalAverage', err);
		}
	}
	handleConnection(client: any, ...args: any[]) {
		console.log('User connected');
		// if (!moment().isBefore(talent.publicSale)) {
	}

	handleDisconnect(client: any) {
		console.log('User disconnected');
	}

	afterInit(server: any) {
		console.log('Socket is live');
	}
}
