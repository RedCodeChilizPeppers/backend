import { AppAbility } from '../casl/casl-ability.factory';

interface IPolicyHandler {
	handle(ability: AppAbility): boolean;
}

type PolicyHandlerCallback = (ability: AppAbility) => boolean;

type PolicyHandler = IPolicyHandler | PolicyHandlerCallback;
