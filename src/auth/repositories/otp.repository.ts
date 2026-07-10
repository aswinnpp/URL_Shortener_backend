import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

import { Otp } from '../../entities/otp.entity';
import type { IOtpRepository } from '../interfaces/otp-repository.interface';

import {
  OtpSchema,
  OtpDocument,
} from '../schemas/otp.schema';

@Injectable()
export class OtpRepository implements IOtpRepository {
  constructor(
    @InjectModel(OtpSchema.name)
    private readonly otpModel: Model<OtpDocument>,
  ) {}

  async create(otp: Otp): Promise<Otp> {
    const created = await this.otpModel.create({
      email: otp.email,
      code: otp.code,
      purpose: otp.purpose,
      expiresAt: otp.expiresAt,
      verified: otp.verified,
    });

    return this.toDomain(created);
  }

  async findValidOtp(
    email: string,
    code: string,
    purpose: 'VERIFY_EMAIL' | 'RESET_PASSWORD',
  ): Promise<Otp | null> {
    const otp = await this.otpModel.findOne({
      email,
      code,
      purpose,
      verified: false,
      expiresAt: { $gt: new Date() },
    });

    if (!otp) {
      return null;
    }

    return this.toDomain(otp);
  }

  async delete(email: string): Promise<void> {
    await this.otpModel.deleteMany({ email });
  }

  private toDomain(doc: OtpDocument): Otp {
    return new Otp(
      doc._id.toString(),
      doc.email,
      doc.code,
      doc.purpose,
      doc.expiresAt,
      doc.verified,
      doc.createdAt,
    );
  }
}
