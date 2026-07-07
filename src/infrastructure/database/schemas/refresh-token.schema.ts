import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RefreshTokenDocument =
  HydratedDocument<RefreshTokenSchema>;

@Schema({
  timestamps: true,
})
export class RefreshTokenSchema {
  @Prop({
    required: true,
  })
  userId: string;

  @Prop({
    required: true,
  })
  tokenHash: string;

  @Prop({
    required: true,
  })
  expiresAt: Date;

  createdAt?: Date;

  updatedAt?: Date;
}

export const RefreshTokenSchemaFactory =
  SchemaFactory.createForClass(
    RefreshTokenSchema,
  );

RefreshTokenSchemaFactory.index(
  {
    expiresAt: 1,
  },
  {
    expireAfterSeconds: 0,
  },
);