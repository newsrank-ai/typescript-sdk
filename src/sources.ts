import type { BaseClient } from './client.js';
import type {
  Category,
  ListSourceRankingsResponse,
  Source,
  Tag,
} from './types.js';

/**
 * Access news sources, categories, tags, and source quality rankings.
 *
 * ```ts
 * const sources = await nr.sources.list();
 * const categories = await nr.sources.categories();
 * const tags = await nr.sources.tags();
 * const { rankings } = await nr.sources.rankings();
 * ```
 */
export class SourcesResource {
  /** @internal */
  constructor(private readonly client: BaseClient) {}

  /**
   * List all indexed news sources.
   *
   * @returns Array of sources with metadata, article counts, and quality scores.
   */
  async list(): Promise<Source[]> {
    return this.client.request<Source[]>('GET', '/sources');
  }

  /**
   * List all article categories.
   *
   * @returns Array of categories.
   */
  async categories(): Promise<Category[]> {
    return this.client.request<Category[]>('GET', '/categories');
  }

  /**
   * List all article tags ordered by frequency.
   *
   * @returns Array of tags with article counts.
   */
  async tags(): Promise<Tag[]> {
    return this.client.request<Tag[]>('GET', '/tags');
  }

  /**
   * Get detailed source quality rankings with scoring breakdowns.
   *
   * @returns Rankings with per-source scores for reliability, neutrality, speed, etc.
   */
  async rankings(): Promise<ListSourceRankingsResponse> {
    return this.client.request<ListSourceRankingsResponse>('GET', '/source-rankings');
  }
}
