import {
	Ability,
	AbilityBuilder,
	AbilityClass,
	ExtractSubjectType,
	MongoAbility,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { ActionEnum } from 'src/enums/action.enum';
import { UserAdmin } from 'src/user-admin/schemas/user-admin.schema';

@Injectable()
export class CaslAbilityFactory {
	createForUser(userAdmin: UserAdmin) {
		const { can, cannot, build } = new AbilityBuilder<
			Ability<[ActionEnum, Subjects]>
		>(Ability as AbilityClass<AppAbility>);

		if (userAdmin) {
			can(ActionEnum.MANAGE, 'all'); // read-write access to everything
		} else {
			can(ActionEnum.READ, 'all'); // read-only access to everything
		}

		return build({
			// Read https://casl.js.org/v5/en/guide/subject-type-detection#use-classes-as-subject-types for details
			detectSubjectType: (item) =>
				item.constructor as ExtractSubjectType<Subjects>,
		});
	}
}
