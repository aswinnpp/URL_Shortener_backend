import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type UrlDocument = HydratedDocument<UrlSchema>;

@Schema({
  timestamps: true,
  collection: 'urls',
})
export class UrlSchema {
  @Prop({ required: true })
  originalUrl!: string;

  @Prop({ required: true, unique: true })
  shortCode!: string;

  @Prop({
    type: Types.ObjectId,
    ref: 'UserSchema',
    required: true,
  })
  userId!: Types.ObjectId;

  @Prop({ default: 0 })
  clicks!: number;

  createdAt!: Date;

  updatedAt!: Date;
}

export const UrlSchemaFactory =
  SchemaFactory.createForClass(UrlSchema);
