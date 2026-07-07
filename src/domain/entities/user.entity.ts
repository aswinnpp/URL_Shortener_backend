export class User {
    constructor(
      public readonly id: string | null,
      public readonly name: string,
      public readonly email: string,
      public password: string,
      public readonly createdAt?: Date,
      public readonly updatedAt?: Date,
    ) {}
  }