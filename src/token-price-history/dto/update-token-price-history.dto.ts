import { PartialType } from '@nestjs/swagger';
import { CreateTokenPriceHistoryDto } from './create-token-price-history.dto';

export class UpdateTokenPriceHistoryDto extends PartialType(CreateTokenPriceHistoryDto) {}
