import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

import { AuthProvider } from '../../../domain/entities/user.entity';

export type UserDocument = HydratedDocument<UserSchema>;

@Schema({
  timestamps: true,
  collection: 'users',
})
export class UserSchema {
  @Prop({
    required: true,
    trim: true,
  })
  name: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  email: string;

  @Prop({
    type: String,
    required: false,
    default: undefined,
  })
  password?: string;

  @Prop({
    default: false,
  })
  isVerified: boolean;

  @Prop({
    type: String,
    enum: AuthProvider,
    default: AuthProvider.LOCAL,
  })
  provider: AuthProvider;

  @Prop({
    type: String,
    required: false,
    default: undefined,
    unique: true,
    sparse: true,
  })
  googleId?: string;

  createdAt: Date;

  updatedAt: Date;
}

export const UserSchemaFactory =
  SchemaFactory.createForClass(UserSchema);