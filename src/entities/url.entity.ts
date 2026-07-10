export class Url {
    constructor(
      public readonly id: string | null,
      public readonly originalUrl: string,
      public readonly shortCode: string,
      public readonly userId: string,
      public clicks: number = 0,
      readonly createdAt: Date,
      public readonly updatedAt?: Date,
    ) {}
  }
