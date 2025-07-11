import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { json, raw, urlencoded } from 'express';
import { AppModule } from './app.module';
import * as bodyParser from 'body-parser';

const rawBodyBuffer = (req, res, buffer, encoding) => {
	if (!req.headers['stripe-signature']) return;

	if (buffer && buffer.length) {
		req.rawBody = buffer.toString(encoding || 'utf8');
	}
};
if (process.env.NODE_ENV === 'production') {
	console.log = function() {};
  }
  
async function bootstrap() {
	const app = await NestFactory.create(AppModule, {
		cors: true,
		bodyParser: false,
	});
	
	app.useGlobalPipes(new ValidationPipe());
	app.setGlobalPrefix('api/v1', { exclude: ['/', 'health'] });
	// app.use('/api/v1/payment', raw({ type: 'application/octet-stream' }));
	app.use(
		json({
			limit: '50mb',
			type: 'application/json',
			verify: rawBodyBuffer,
		}),
	);
	app.use(
		urlencoded({ extended: true, limit: '50mb', verify: rawBodyBuffer }),
	);
	// app.enableCors();
	await app.listen(process.env.port || 8080);
	console.log(process.env.NODE_ENV);
	console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
