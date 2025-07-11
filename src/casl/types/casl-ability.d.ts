type Subjects = InferSubjects<typeof Article | typeof User> | 'all';

type AppAbility = Ability<[Action, Subjects]>;
