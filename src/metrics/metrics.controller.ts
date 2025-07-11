import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
} from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { CreateMetricDto } from './dto/create-metric.dto';
import { UpdateMetricDto } from './dto/update-metric.dto';

@Controller('metrics')
export class MetricsController {
	constructor(private readonly metricsService: MetricsService) {}

	@Post('create')
	create(@Body() createMetricDto: CreateMetricDto) {
		return this.metricsService.create(createMetricDto);
	}

	@Get('all')
	findAll() {
		return this.metricsService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.metricsService.findOne(id);
	}

	@Patch('update/:id')
	update(@Param('id') id: string, @Body() updateMetricDto: UpdateMetricDto) {
		return this.metricsService.update(id, updateMetricDto);
	}

	@Delete('delete/:id')
	remove(@Param('id') id: string) {
		return this.metricsService.remove(id);
	}
}
