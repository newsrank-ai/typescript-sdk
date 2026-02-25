import { BaseClient, NewsRankError } from './client.js';
import { ArticlesResource } from './articles.js';
import { StoriesResource } from './stories.js';
import { SearchResource } from './search.js';
import { EntitiesResource } from './entities.js';
import { SourcesResource } from './sources.js';
import { GraphResource } from './graph.js';
import { MetaResource } from './meta.js';

import type { NewsRankOptions } from './types.js';

const DEFAULT_BASE_URL = 'https://newsrank.ai/api/v1';
const DEFAULT_TIMEOUT = 30_000;

/**
 * Official TypeScript client for the NewsRank AI API.
 *
 * ```ts
 * import { NewsRank } from '@newsrank/sdk';
 *
 * const nr = new NewsRank('nrf_...');
 *
 * const { items } = await nr.articles.list({ limit: 10, category: 'politics' });
 * const story = await nr.stories.get('supreme-court-climate-ruling');
 * const trending = await nr.entities.trending({ limit: 5 });
 * ```
 */
export class NewsRank {
  /** Access articles (news items). */
  readonly articles: ArticlesResource;

  /** Access stories (article clusters). */
  readonly stories: StoriesResource;

  /** Search articles and get autocomplete suggestions. */
  readonly search: SearchResource;

  /** Access named entities (people, organisations, locations). */
  readonly entities: EntitiesResource;

  /** Access news sources, categories, tags, and rankings. */
  readonly sources: SourcesResource;

  /** Knowledge graph: entity networks, story graphs, topic clusters. */
  readonly graph: GraphResource;

  /** Related articles, platform stats, version info, API usage. */
  readonly meta: MetaResource;

  /**
   * Create a new NewsRank client.
   *
   * @param apiKey - Your NewsRank API key (starts with `nrf_`).
   * @param options - Optional configuration overrides.
   */
  constructor(apiKey: string, options: NewsRankOptions = {}) {
    const client = new BaseClient({
      apiKey,
      baseUrl: options.baseUrl ?? DEFAULT_BASE_URL,
      fetch: options.fetch ?? globalThis.fetch.bind(globalThis),
      timeout: options.timeout ?? DEFAULT_TIMEOUT,
    });

    this.articles = new ArticlesResource(client);
    this.stories = new StoriesResource(client);
    this.search = new SearchResource(client);
    this.entities = new EntitiesResource(client);
    this.sources = new SourcesResource(client);
    this.graph = new GraphResource(client);
    this.meta = new MetaResource(client);
  }
}

// ---------------------------------------------------------------------------
// Re-exports — everything is available from the top-level import
// ---------------------------------------------------------------------------

export { NewsRankError } from './client.js';
export type { BaseClient, ClientOptions } from './client.js';

export { ArticlesResource } from './articles.js';
export { StoriesResource } from './stories.js';
export { SearchResource } from './search.js';
export { EntitiesResource } from './entities.js';
export { SourcesResource } from './sources.js';
export { GraphResource } from './graph.js';
export { MetaResource } from './meta.js';

// Re-export every type from types.ts
export type {
  NewsRankOptions,
  PaginationParams,
  Article,
  ArticleDetail,
  ArticleContent,
  ListArticlesParams,
  ListArticlesResponse,
  GetArticleParams,
  GetArticleContentParams,
  Story,
  StoryDetail,
  StoryDevelopment,
  StoryUpdate,
  ListStoriesParams,
  ListStoriesResponse,
  ListRankedStoriesParams,
  ListRankedStoriesResponse,
  ListStoryDevelopmentsResponse,
  GetStoryUpdatesParams,
  GetStoryUpdatesResponse,
  SearchParams,
  SearchResult,
  SearchArticlesResponse,
  SearchFullResponse,
  SearchSuggestParams,
  SearchSuggestion,
  Entity,
  EntityRef,
  EntityAlias,
  EntityDetail,
  TrendingEntity,
  ListEntitiesParams,
  ListEntitiesResponse,
  ListTrendingEntitiesParams,
  ListTrendingEntitiesResponse,
  ListPoliticiansParams,
  ListPoliticiansResponse,
  ListEntityArticlesParams,
  ListEntityArticlesResponse,
  Source,
  Category,
  Tag,
  SourceRanking,
  ListSourceRankingsResponse,
  GraphNode,
  GraphEdge,
  GraphResponse,
  GetEntityNetworkParams,
  GetStoryEntityGraphParams,
  GetTopicClusterGraphParams,
  RelatedArticlesParams,
  Stats,
  VersionInfo,
  UsageParams,
  UsageRecord,
  UsageResponse,
} from './types.js';
