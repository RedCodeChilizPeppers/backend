import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateMetricDto } from './dto/create-metric.dto';
import { UpdateMetricDto } from './dto/update-metric.dto';
import { Metric, MetricDocument } from './schemas/metrics.schema';

@Injectable()
export class MetricsService {
	constructor(
		@InjectModel(Metric.name)
		private metricModel: Model<MetricDocument>,
	) {}
	async create(createMetricDto: CreateMetricDto) {
		const createMetric = await this.metricModel.create(createMetricDto);
		return createMetric;
	}

	findAll() {
		return this.metricModel.find();
	}

	findOne(id: string) {
		return this.metricModel.findOne({ _id: id }).exec();
	}

	async update(id: string, updateMetricDto: UpdateMetricDto) {
		const updateMetric = await this.metricModel.findOneAndUpdate(
			{ _id: id },
			updateMetricDto,
		);
		return updateMetric;
	}

	async remove(id: string) {
		const deletedCat = await this.metricModel
			.findByIdAndRemove({ _id: id })
			.exec();
		return deletedCat;
	}
}
