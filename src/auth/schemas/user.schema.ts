import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<UserSchema>;

export enum AuthProvider {
  LOCAL = 'LOCAL',
  GOOGLE = 'GOOGLE',
}

export class User {
  constructor(
    public readonly id: string | null,
    public readonly name: string,
    public readonly email: string,
    public readonly password: string | null,
    public readonly isVerified: boolean,
    public readonly provider: AuthProvider = AuthProvider.LOCAL,
    public readonly googleId: string | null = null,
    public readonly createdAt?: Date,
    public readonly updatedAt?: Date,
  ) {}
}

@Schema({
  timestamps: true,
  collection: 'users',
})
export class UserSchema {
  @Prop({
    required: true,
    trim: true,
  })
  name!: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  email!: string;

  @Prop({
    type: String,
    required: false,
    default: undefined,
  })
  password?: string;

  @Prop({
    default: false,
  })
  isVerified!: boolean;

  @Prop({
    type: String,
    enum: AuthProvider,
    default: AuthProvider.LOCAL,
  })
  provider!: AuthProvider;

  @Prop({
    type: String,
    required: false,
    default: undefined,
    unique: true,
    sparse: true,
  })
  googleId?: string;

  createdAt!: Date;

  updatedAt!: Date;
}

export const UserSchemaFactory =
  SchemaFactory.createForClass(UserSchema);
