import type { BaseClient } from './client.js';
import type {
  EntityDetail,
  ListEntitiesParams,
  ListEntitiesResponse,
  ListEntityArticlesParams,
  ListEntityArticlesResponse,
  ListPoliticiansParams,
  ListPoliticiansResponse,
  ListTrendingEntitiesParams,
  ListTrendingEntitiesResponse,
} from './types.js';

/**
 * Access named entities (people, organisations, locations) extracted from articles.
 *
 * ```ts
 * const { entities } = await nr.entities.list({ type: 'person', limit: 10 });
 * const trending = await nr.entities.trending({ limit: 5 });
 * const detail = await nr.entities.get(636);
 * const { items } = await nr.entities.articles(636, { limit: 20 });
 * ```
 */
export class EntitiesResource {
  /** @internal */
  constructor(private readonly client: BaseClient) {}

  /**
   * List entities with optional search, type filter, and pagination.
   *
   * @param params - Filtering / pagination options.
   * @returns Paginated list of entities.
   */
  async list(params: ListEntitiesParams = {}): Promise<ListEntitiesResponse> {
    return this.client.request<ListEntitiesResponse>('GET', '/entities', params);
  }

  /**
   * List currently trending entities based on recent article volume.
   *
   * @param params - Optional limit.
   * @returns List of trending entities with counts and time window.
   */
  async trending(params: ListTrendingEntitiesParams = {}): Promise<ListTrendingEntitiesResponse> {
    return this.client.request<ListTrendingEntitiesResponse>(
      'GET',
      '/entities/trending',
      params,
    );
  }

  /**
   * List politician entities specifically.
   *
   * @param params - Optional pagination.
   * @returns Paginated list of politician entities.
   */
  async politicians(params: ListPoliticiansParams = {}): Promise<ListPoliticiansResponse> {
    return this.client.request<ListPoliticiansResponse>(
      'GET',
      '/entities/politicians',
      params,
    );
  }

  /**
   * Get a single entity by numeric ID or slug string.
   *
   * @param id - Entity ID (number) or slug (string).
   * @returns Entity detail including aliases.
   */
  async get(id: number | string): Promise<EntityDetail> {
    return this.client.request<EntityDetail>('GET', `/entities/${encodeURIComponent(id)}`);
  }

  /**
   * List articles associated with a specific entity.
   *
   * @param id - Entity ID (number) or slug (string).
   * @param params - Optional pagination.
   * @returns Paginated list of articles mentioning the entity.
   */
  async articles(id: number | string, params: ListEntityArticlesParams = {}): Promise<ListEntityArticlesResponse> {
    return this.client.request<ListEntityArticlesResponse>(
      'GET',
      `/entities/${encodeURIComponent(id)}/articles`,
      params,
    );
  }
}
