import { Url } from '../entities/url.entity';
export interface IUrlRepository {
  create(url: Url): Promise<Url>;
  findByShortCode(shortCode: string): Promise<Url | null>;
  findByUser(userId: string, page: number, limit: number, search?: string, sortBy?: string, order?: 'asc' | 'desc'): Promise<{ urls: Url[]; total: number }>;
  delete(id: string): Promise<void>;
  findByUserId(userId: string): Promise<Url[]>;
  findById(id: string): Promise<Url | null>;
  delete(id: string): Promise<void>;
  update(url: Url): Promise<Url>;
  incrementClicks(shortCode: string): Promise<void>;
}
