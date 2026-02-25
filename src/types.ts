// ---------------------------------------------------------------------------
// Client options
// ---------------------------------------------------------------------------

export interface NewsRankOptions {
  /** API base URL. Defaults to `https://newsrank.ai/api/v1`. */
  baseUrl?: string;

  /** Custom `fetch` implementation for testing or environments without global fetch. */
  fetch?: typeof globalThis.fetch;

  /**
   * Default request timeout in milliseconds.
   * Pass `0` to disable. Defaults to `30_000` (30 seconds).
   */
  timeout?: number;
}

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------

export interface PaginationParams {
  /** Maximum number of results to return. */
  limit?: number;
  /** Number of results to skip. */
  offset?: number;
}

// ---------------------------------------------------------------------------
// Articles
// ---------------------------------------------------------------------------

export interface Article {
  id: number;
  url_hash: string;
  slug: string;
  title: string;
  url: string;
  source_id: string;
  source_name: string;
  category: string;
  source_language?: string;
  published_at: number;
  discovered_at: number;
  image_url?: string;
  placeholder_image_url?: string;
  content_status: string;
  headline_summary?: string;
}

export interface ArticleDetail {
  item: Article;
  entities: EntityRef[];
  tags: Tag[];
  ok: boolean;
}

export interface ArticleContent {
  url_hash: string;
  ok: boolean;
  text: string;
  truncated: boolean;
  extracted_at: number;
  extracted_title: string;
  final_url: string;
  full_summary: string;
  headline_summary: string;
  image_url: string;
  thumb_url: string;
  video_url: string;
  tags: Tag[];
}

export interface ListArticlesParams extends PaginationParams {
  category?: string;
  keyword?: string;
  source?: string;
  content_status?: string;
  date_from?: string;
  date_to?: string;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

export interface ListArticlesResponse {
  items: Article[];
  total: number;
  offset: number;
  limit: number;
}

export interface GetArticleParams {
  url_hash?: string;
  slug?: string;
}

export interface GetArticleContentParams {
  url_hash: string;
  max_chars?: number;
}

// ---------------------------------------------------------------------------
// Stories
// ---------------------------------------------------------------------------

export interface Story {
  id: number;
  slug: string;
  title: string;
  summary: string;
  category: string;
  article_count: number;
  first_seen: number;
  last_updated: number;
  image_url?: string;
  placeholder_image_url?: string;
  importance_score?: number;
  entities?: EntityRef[];
  top_sources?: string[];
}

export interface StoryDetail extends Story {
  articles?: Article[];
  timeline?: StoryDevelopment[];
}

export interface StoryDevelopment {
  id: number;
  story_id: number;
  title: string;
  summary: string;
  timestamp: number;
  article_count: number;
  articles?: Article[];
}

export interface StoryUpdate {
  id: number;
  story_id: number;
  update_type: string;
  title: string;
  summary: string;
  timestamp: number;
}

export interface ListStoriesParams extends PaginationParams {
  category?: string;
}

export interface ListStoriesResponse {
  stories: Story[];
}

export interface ListRankedStoriesParams {
  limit?: number;
}

export interface ListRankedStoriesResponse {
  stories: Story[];
  count: number;
  priority: string;
}

export interface ListStoryDevelopmentsResponse {
  developments: StoryDevelopment[];
}

export interface GetStoryUpdatesParams {
  since_ms: number;
}

export interface GetStoryUpdatesResponse {
  updates: StoryUpdate[];
}

// ---------------------------------------------------------------------------
// Search
// ---------------------------------------------------------------------------

export interface SearchParams extends PaginationParams {
  q: string;
}

export interface SearchResult {
  id?: number;
  url_hash?: string;
  url_hash_hex?: string;
  slug?: string;
  title: string;
  url?: string;
  source_id?: string;
  source_name?: string;
  category?: string;
  published_at?: number;
  published_at_ms?: number;
  discovered_at?: number;
  discovered_at_ms?: number;
  placeholder_image_url?: string;
  snippet?: string;
  rank?: number;
}

export interface SearchArticlesResponse {
  results: SearchResult[];
  total?: number;
}

export interface SearchFullResponse {
  results: SearchResult[];
  total?: number;
}

export interface SearchSuggestParams {
  q: string;
  limit?: number;
}

export interface SearchSuggestion {
  type: string;
  text: string;
  slug?: string;
  entity_type?: string;
}

// ---------------------------------------------------------------------------
// Entities
// ---------------------------------------------------------------------------

export interface Entity {
  id: number;
  name: string;
  normalized_name: string;
  type: string;
  subcategory?: string;
  article_count: number;
  description?: string;
  image_url?: string;
  slug: string;
}

export interface EntityRef {
  id: number;
  name: string;
  type: string;
  slug?: string;
}

export interface EntityAlias {
  id: number;
  alias: string;
  normalized_alias: string;
  entity_id: number;
  source: string;
}

export interface EntityDetail {
  entity: Entity;
  aliases: EntityAlias[];
}

export interface TrendingEntity extends Entity {
  /** Trending score or recent article count in the trending window. */
  trending_score?: number;
}

export interface ListEntitiesParams extends PaginationParams {
  q?: string;
  type?: string;
  subcategory?: string;
}

export interface ListEntitiesResponse {
  entities: Entity[];
  total: number;
  offset: number;
  limit: number;
}

export interface ListTrendingEntitiesParams {
  limit?: number;
}

export interface ListTrendingEntitiesResponse {
  entities: TrendingEntity[];
  count: number;
  since_ms: number;
}

export interface ListPoliticiansParams extends PaginationParams {}

export interface ListPoliticiansResponse {
  entities: Entity[];
  total: number;
  offset: number;
  limit: number;
}

export interface ListEntityArticlesParams extends PaginationParams {}

export interface ListEntityArticlesResponse {
  items: Article[];
  total: number;
  offset: number;
  limit: number;
}

// ---------------------------------------------------------------------------
// Sources & Categories
// ---------------------------------------------------------------------------

export interface Source {
  source_id: string;
  source_name: string;
  logo_url?: string;
  category: string;
  article_count: number;
  top_entities: EntityRef[];
  description_one_liner?: string;
  description_summary?: string;
  tier?: string;
  overall_score?: number;
  reliability_score?: number;
}

export interface Category {
  id: number;
  slug: string;
  name: string;
  description: string;
}

export interface Tag {
  name: string;
  article_count?: number;
}

export interface SourceRanking {
  source_id: string;
  source_name: string;
  first_to_cluster_score: number;
  cluster_frequency_score: number;
  speed_score: number;
  topical_authority_score: number;
  content_diversity_score: number;
  extraction_success_score: number;
  neutrality_score: number;
  sensationalism_score: number;
  reliability_score: number;
  overall_score: number;
  tier: string;
  description_one_liner?: string;
  description_summary?: string;
  description_updated_at_ms?: number;
  last_updated_at_ms?: number;
}

export interface ListSourceRankingsResponse {
  count: number;
  rankings: SourceRanking[];
}

// ---------------------------------------------------------------------------
// Graph
// ---------------------------------------------------------------------------

export interface GraphNode {
  id: number | string;
  label: string;
  type: string;
  weight?: number;
  [key: string]: unknown;
}

export interface GraphEdge {
  source: number | string;
  target: number | string;
  weight?: number;
  label?: string;
  [key: string]: unknown;
}

export interface GraphResponse {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export interface GetEntityNetworkParams {
  entity_id: number;
  depth?: number;
  limit?: number;
}

export interface GetStoryEntityGraphParams {
  story_id: number;
  limit?: number;
}

export interface GetTopicClusterGraphParams {
  topic_id?: number;
  limit?: number;
}

// ---------------------------------------------------------------------------
// Meta
// ---------------------------------------------------------------------------

export interface RelatedArticlesParams {
  url_hash: string;
  limit?: number;
}

export interface Stats {
  total_articles: number;
  has_content: number;
  failed: number;
  no_content: number;
  avg_content_len: number;
  enriched: number;
  not_enriched: number;
  summarized: number;
  not_summarized: number;
  embeddings: number;
  embeddings_pct: number;
  total_entities: number;
  total_links: number;
  total_tags: number;
  total_tag_links: number;
  entity_types: Array<{ type: string; count: number }>;
  top_entities: Array<{
    name: string;
    type: string;
    article_count: number;
  }>;
}

export interface VersionInfo {
  api_latest: string;
  api_major: string;
  generated_at: string;
  sdk_recommendations: Record<string, string>;
  sunset: Record<string, string>;
  supported_api_majors: string[];
}

export interface UsageParams {
  from?: string;
  to?: string;
}

export interface UsageRecord {
  date: string;
  endpoint: string;
  count: number;
}

export interface UsageResponse {
  records: UsageRecord[];
  total: number;
}
