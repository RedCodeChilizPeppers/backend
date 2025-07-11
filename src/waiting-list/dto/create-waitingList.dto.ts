import { Talent } from "src/talents/schemas/talent.schema";

export class CreateWaitingListDto {
    
	userId: string;
	talent: Talent;

}
