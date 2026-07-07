import { Url } from '../entities/url.entity';

export interface IUrlRepository {
  create(url: Url): Promise<Url>;

  findByShortCode(shortCode: string): Promise<Url | null>;

  findByUser(userId: string): Promise<Url[]>;

  delete(id: string): Promise<void>;

  findByUserId(userId: string): Promise<Url[]>;
  findById(id: string): Promise<Url | null>;

   delete(id: string): Promise<void>;

  incrementClicks(shortCode: string): Promise<void>;
}