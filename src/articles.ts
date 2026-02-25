import type { BaseClient } from './client.js';
import type {
  ArticleContent,
  ArticleDetail,
  GetArticleContentParams,
  GetArticleParams,
  ListArticlesParams,
  ListArticlesResponse,
} from './types.js';

/**
 * Access articles (news items) indexed by NewsRank.
 *
 * ```ts
 * const { items, total } = await nr.articles.list({ limit: 10, category: 'politics' });
 * const detail = await nr.articles.get({ url_hash: '...' });
 * const content = await nr.articles.content({ url_hash: '...' });
 * ```
 */
export class ArticlesResource {
  /** @internal */
  constructor(private readonly client: BaseClient) {}

  /**
   * List articles with optional filtering, pagination, and sorting.
   *
   * @param params - Filtering / pagination options.
   * @returns Paginated list of articles.
   */
  async list(params: ListArticlesParams = {}): Promise<ListArticlesResponse> {
    return this.client.request<ListArticlesResponse>('GET', '/items', params);
  }

  /**
   * Get a single article by its URL hash or slug.
   *
   * You must provide at least one of `url_hash` or `slug`.
   *
   * @param params - Identifier for the article.
   * @returns Detailed article object including entities and tags.
   */
  async get(params: GetArticleParams): Promise<ArticleDetail> {
    return this.client.request<ArticleDetail>('GET', '/item', params);
  }

  /**
   * Get the extracted full-text content for an article.
   *
   * @param params - Must include `url_hash`. Optionally set `max_chars` to truncate.
   * @returns The article content including text, summary, and media URLs.
   */
  async content(params: GetArticleContentParams): Promise<ArticleContent> {
    return this.client.request<ArticleContent>('GET', '/content', params);
  }
}
