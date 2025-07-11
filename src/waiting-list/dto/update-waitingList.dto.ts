import { PartialType } from '@nestjs/swagger';
import { CreateWaitingListDto } from './create-waitingList.dto';

export class UpdateWaitingListDto extends PartialType(CreateWaitingListDto) {}
