import type { BaseClient } from './client.js';
import type {
  Article,
  RelatedArticlesParams,
  Stats,
  UsageParams,
  UsageResponse,
  VersionInfo,
} from './types.js';

/**
 * Miscellaneous meta endpoints: related articles, platform stats, version
 * info, and API usage.
 *
 * ```ts
 * const stats = await nr.meta.stats();
 * const version = await nr.meta.version();
 * const related = await nr.meta.related({ url_hash: '...', limit: 5 });
 * const usage = await nr.meta.usage({ from: '2026-01-01', to: '2026-01-31' });
 * ```
 */
export class MetaResource {
  /** @internal */
  constructor(private readonly client: BaseClient) {}

  /**
   * Get articles related to a given article (by semantic similarity).
   *
   * @param params - Must include `url_hash`. Optional `limit`.
   * @returns Array of related articles.
   */
  async related(params: RelatedArticlesParams): Promise<Article[]> {
    return this.client.request<Article[]>('GET', '/related', params);
  }

  /**
   * Get platform-wide statistics: article counts, entity counts,
   * enrichment progress, and top entities.
   *
   * @returns Stats snapshot.
   */
  async stats(): Promise<Stats> {
    return this.client.request<Stats>('GET', '/stats');
  }

  /**
   * Get API version info. This endpoint does **not** require authentication.
   *
   * @returns Version metadata including supported API majors and SDK recommendations.
   */
  async version(): Promise<VersionInfo> {
    return this.client.request<VersionInfo>('GET', '/version');
  }

  /**
   * Get your API key usage statistics for a date range.
   *
   * @param params - Optional `from` and `to` date strings (YYYY-MM-DD).
   * @returns Usage records grouped by date and endpoint.
   */
  async usage(params: UsageParams = {}): Promise<UsageResponse> {
    return this.client.request<UsageResponse>('GET', '/usage', params);
  }
}
