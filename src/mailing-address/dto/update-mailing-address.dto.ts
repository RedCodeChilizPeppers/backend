import { PartialType } from '@nestjs/swagger';
import { CreateMailingAddressDto } from './create-mailing-address.dto';

export class UpdateMailingAddressDto extends PartialType(
	CreateMailingAddressDto,
) {}
