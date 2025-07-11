import { Module } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { MetricsController } from './metrics.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Metric, MetricSchema } from './schemas/metrics.schema';

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Metric.name, schema: MetricSchema },
		]),
	],
	controllers: [MetricsController],
	providers: [MetricsService],
})
export class MetricsModule {}
