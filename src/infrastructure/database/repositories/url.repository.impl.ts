import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { Url } from '../../../domain/entities/url.entity';
import { IUrlRepository } from '../../../domain/repositories/url.repository';
import { UrlSchema, UrlDocument } from '../schemas/url.schema';

@Injectable()
export class UrlRepositoryImpl implements IUrlRepository {
  constructor(
    @InjectModel(UrlSchema.name)
    private readonly urlModel: Model<UrlDocument>,
  ) {}

  async create(url: Url): Promise<Url> {
    const created = await this.urlModel.create({
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      userId: url.userId,
      clicks: url.clicks,
    });

    return this.toDomain(created);
  }

  async findByShortCode(shortCode: string): Promise<Url | null> {
    const url = await this.urlModel.findOne({ shortCode });

    if (!url) return null;

    return this.toDomain(url);
  }

  async findByUser(
    userId: string,
    page: number,
    limit: number,
    search?: string,
    sortBy = 'createdAt',
    order: 'asc' | 'desc' = 'desc',
  ): Promise<{
    urls: Url[];
    total: number;
  }> {
    const filter: any = {
      userId,
    };
  
    if (search) {
      filter.$or = [
        {
          originalUrl: {
            $regex: search,
            $options: 'i',
          },
        },
        {
          shortCode: {
            $regex: search,
            $options: 'i',
          },
        },
      ];
    }
  
    const skip = (page - 1) * limit;
  
    const [urls, total] = await Promise.all([
      this.urlModel
        .find(filter)
        .sort({
          [sortBy]: order === 'asc' ? 1 : -1,
        })
        .skip(skip)
        .limit(limit),
  
      this.urlModel.countDocuments(filter),
    ]);
  
    return {
      urls: urls.map((url) => this.toDomain(url)),
      total,
    };
  }

  async incrementClicks(shortCode: string): Promise<void> {
    await this.urlModel.updateOne(
      { shortCode },
      { $inc: { clicks: 1 } },
    );
  }

  async findByUserId(userId: string): Promise<Url[]> {
    const urls = await this.urlModel.find({ userId });
  
    return urls.map((url) => this.toDomain(url));
  }



  async findById(id: string): Promise<Url | null> {
    const url = await this.urlModel.findById(id);
  
    if (!url) {
      return null;
    }
  
    return this.toDomain(url);
  }

  async update(url: Url): Promise<Url> {
    const updatedUrl = await this.urlModel.findByIdAndUpdate(
      url.id,
      {
        originalUrl: url.originalUrl,
      },
      {
        new: true,
      },
    );
  
    if (!updatedUrl) {
      throw new Error('URL not found');
    }
  
    return this.toDomain(updatedUrl);
  }
  
  async delete(id: string): Promise<void> {
    await this.urlModel.findByIdAndDelete(id);
  }

  private toDomain(url: UrlDocument): Url {
    return new Url(
      url._id.toString(),
      url.originalUrl,
      url.shortCode,
      url.userId.toString(),
      url.clicks,
      url.createdAt,
      url.updatedAt,
    );
  }
}