# @newsrank/sdk

Official TypeScript SDK for the [NewsRank AI](https://newsrank.ai) API.

Zero dependencies. Works in Node.js 18+, Deno, Bun, and browsers.

## Installation

```bash
npm install @newsrank/sdk
```

```bash
pnpm add @newsrank/sdk
```

```bash
yarn add @newsrank/sdk
```

## Quick Start

```typescript
import { NewsRank } from '@newsrank/sdk';

const nr = new NewsRank('nrf_your_api_key');

// List recent politics articles
const { items, total } = await nr.articles.list({
  category: 'politics',
  limit: 10,
});

console.log(`Found ${total} politics articles`);
for (const article of items) {
  console.log(`- ${article.title} (${article.source_name})`);
}
```

## Configuration

```typescript
const nr = new NewsRank('nrf_...', {
  // Custom base URL (for testing or self-hosted instances)
  baseUrl: 'https://newsrank.ai/api/v1',

  // Request timeout in milliseconds (default: 30000)
  timeout: 10_000,

  // Custom fetch implementation (for mocking in tests)
  fetch: myCustomFetch,
});
```

## API Reference

### Articles

```typescript
// List articles with filtering and pagination
const { items, total } = await nr.articles.list({
  limit: 20,
  offset: 0,
  category: 'technology',
  keyword: 'AI',
  source: 'reuters',
  content_status: 'ok',
  date_from: '2026-01-01',
  date_to: '2026-01-31',
  sort_by: 'published_at',
  sort_order: 'desc',
});

// Get a single article by URL hash or slug
const detail = await nr.articles.get({ url_hash: 'abc123...' });
const detail2 = await nr.articles.get({ slug: 'article-slug-12345' });
// Returns: { item, entities, tags, ok }

// Get extracted full-text content
const content = await nr.articles.content({ url_hash: 'abc123...' });
const truncated = await nr.articles.content({ url_hash: 'abc123...', max_chars: 1000 });
// Returns: { text, full_summary, headline_summary, image_url, ... }
```

### Stories

Stories are automatically clustered groups of related articles covering the same event.

```typescript
// List stories
const { stories } = await nr.stories.list({ category: 'world', limit: 10 });

// List stories ranked by importance
const ranked = await nr.stories.ranked({ limit: 5 });

// Get a story by ID or slug
const story = await nr.stories.get(42);
const storyBySlug = await nr.stories.get('supreme-court-climate-ruling');

// Get story development timeline
const { developments } = await nr.stories.developments(42);

// Poll for updates since a timestamp
const { updates } = await nr.stories.updates(42, {
  since_ms: Date.now() - 3600_000, // last hour
});
```

### Search

```typescript
// Simple keyword search
const results = await nr.search.articles({ q: 'climate change', limit: 10 });

// Full-text search with snippets and relevance ranking
const full = await nr.search.full({ q: 'climate change', limit: 10 });
// Returns: { results: [{ title, snippet, rank, ... }], total }

// Autocomplete suggestions
const suggestions = await nr.search.suggest({ q: 'clim', limit: 5 });
// Returns: [{ type: 'entity', text: 'Climate Pledge Arena', entity_type: 'location' }, ...]
```

### Entities

Entities are people, organisations, and locations extracted from articles via NER.

```typescript
// List entities with optional search and type filter
const { entities, total } = await nr.entities.list({
  q: 'trump',
  type: 'person',
  limit: 10,
});

// Get trending entities
const trending = await nr.entities.trending({ limit: 10 });
// Returns: { entities, count, since_ms }

// List politicians specifically
const politicians = await nr.entities.politicians({ limit: 20 });

// Get entity detail (includes aliases)
const entity = await nr.entities.get(57);
const entityBySlug = await nr.entities.get('donald-trump-57');
// Returns: { entity, aliases }

// List articles mentioning an entity
const { items: entityArticles } = await nr.entities.articles(57, { limit: 20 });
```

### Sources, Categories & Tags

```typescript
// List all indexed news sources
const sources = await nr.sources.list();
// Returns: [{ source_id, source_name, category, article_count, tier, ... }]

// List categories
const categories = await nr.sources.categories();
// Returns: [{ id, slug, name, description }]

// List tags by frequency
const tags = await nr.sources.tags();
// Returns: [{ name, article_count }]

// Get detailed source quality rankings
const { rankings, count } = await nr.sources.rankings();
// Returns scored rankings with reliability, neutrality, speed, etc.
```

### Graph

Knowledge graph endpoints for exploring entity relationships and topic clusters.

```typescript
// Entity co-occurrence network
const graph = await nr.graph.entityNetwork({
  entity_id: 57,
  depth: 2,
  limit: 50,
});
// Returns: { nodes: [...], edges: [...] }

// Story-entity relationship graph
const storyGraph = await nr.graph.storyEntity({
  story_id: 42,
  limit: 30,
});

// Topic cluster graph
const clusters = await nr.graph.topicCluster({ limit: 10 });
```

### Meta

```typescript
// Get related articles (by semantic similarity)
const related = await nr.meta.related({ url_hash: 'abc123...', limit: 5 });

// Platform-wide statistics
const stats = await nr.meta.stats();
// Returns: { total_articles, total_entities, entity_types, top_entities, ... }

// API version info (no auth required)
const version = await nr.meta.version();
// Returns: { api_latest, supported_api_majors, sdk_recommendations, ... }

// Your API key usage
const usage = await nr.meta.usage({ from: '2026-01-01', to: '2026-01-31' });
```

## Error Handling

All API errors throw a `NewsRankError` with the HTTP status code and response body:

```typescript
import { NewsRank, NewsRankError } from '@newsrank/sdk';

const nr = new NewsRank('nrf_...');

try {
  await nr.articles.get({ url_hash: 'nonexistent' });
} catch (err) {
  if (err instanceof NewsRankError) {
    console.error(`API error ${err.status}: ${err.message}`);
    console.error('Response body:', err.body);
  }
}
```

Timeout errors have `status: 0`:

```typescript
const nr = new NewsRank('nrf_...', { timeout: 5_000 });

try {
  await nr.search.full({ q: 'very complex query' });
} catch (err) {
  if (err instanceof NewsRankError && err.status === 0) {
    console.error('Request timed out');
  }
}
```

## TypeScript Types

All request parameters and response objects are fully typed. Import any type directly:

```typescript
import type {
  Article,
  Story,
  Entity,
  SearchResult,
  Source,
  Stats,
  ListArticlesParams,
  ListArticlesResponse,
} from '@newsrank/sdk';
```

## Requirements

- **Node.js** 18+ (uses native `fetch`)
- **Deno** 1.28+
- **Bun** 0.5+
- Modern browsers with `fetch` support

## License

MIT
