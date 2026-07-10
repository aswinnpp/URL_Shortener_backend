import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { User } from '../../entities/user.entity';
import { IUserRepository } from '../interfaces/user-repository.interface';
import {
  UserSchema,
  UserDocument,
} from '../schemas/user.schema';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectModel(UserSchema.name)
    private readonly userModel: Model<UserDocument>,
  ) { }

  async create(user: User): Promise<User> {
    const createdUser = await this.userModel.create({
      name: user.name,
      email: user.email,
      password: user.password ?? undefined,
      isVerified: user.isVerified,
      provider: user.provider,
      googleId: user.googleId ?? undefined,
    });

    return this.toDomain(createdUser);
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.userModel.findOne({ email });

    if (!user) return null;

    return this.toDomain(user);
  }

  async findById(id: string): Promise<User | null> {
    const user = await this.userModel.findById(id);

    if (!user) return null;

    return this.toDomain(user);
  }

  async update(user: User): Promise<User> {
    const updatedUser = await this.userModel.findByIdAndUpdate(
      user.id,
      {
        name: user.name,
        email: user.email,
        password: user.password,
        isVerified: user.isVerified,
        provider: user.provider,
        googleId: user.googleId ?? undefined,
      },
      { new: true },
    );

    if (!updatedUser) {
      throw new Error('User not found');
    }

    return this.toDomain(updatedUser);
  }

  async delete(id: string): Promise<void> {
    await this.userModel.findByIdAndDelete(id);
  }

  async verifyEmail(email: string): Promise<void> {
    await this.userModel.updateOne(
      { email },
      {
        $set: {
          isVerified: true,
        },
      },
    );
  }

  async updatePassword(
    email: string,
    password: string,
  ): Promise<void> {
    await this.userModel.updateOne(
      { email },
      {
        $set: {
          password,
        },
      },
    );
  }

  private toDomain(user: UserDocument): User {
    return new User(
      user._id.toString(),
      user.name,
      user.email,
      user.password ?? null,
      user.isVerified,
      user.provider,
      user.googleId ?? null,
      user.createdAt,
      user.updatedAt,
    );
  }
}
