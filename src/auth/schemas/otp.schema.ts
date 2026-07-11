import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type OtpDocument = HydratedDocument<OtpSchema>;

@Schema({
  timestamps: true,
})
export class OtpSchema {
  @Prop({ required: true })
  email!: string;

  @Prop({ required: true })
  code!: string;

  @Prop({
    required: true,
    enum: ['VERIFY_EMAIL', 'RESET_PASSWORD'],
  })
  purpose!: 'VERIFY_EMAIL' | 'RESET_PASSWORD';

  @Prop({ required: true })
  expiresAt!: Date;

  @Prop({
    default: false,
  })
  verified!: boolean;

  createdAt?: Date;

  updatedAt?: Date;
}

export const OtpSchemaFactory =
  SchemaFactory.createForClass(OtpSchema);

OtpSchemaFactory.index(
  { expiresAt: 1 },
  { expireAfterSeconds: 0 },
);
