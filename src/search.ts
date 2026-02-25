import type { BaseClient } from './client.js';
import type {
  SearchArticlesResponse,
  SearchFullResponse,
  SearchParams,
  SearchSuggestParams,
  SearchSuggestion,
} from './types.js';

/**
 * Search articles and get autocomplete suggestions.
 *
 * ```ts
 * const results = await nr.search.articles({ q: 'climate' });
 * const full = await nr.search.full({ q: 'climate', limit: 5 });
 * const suggestions = await nr.search.suggest({ q: 'clim' });
 * ```
 */
export class SearchResource {
  /** @internal */
  constructor(private readonly client: BaseClient) {}

  /**
   * Search articles by keyword. Returns lightweight results
   * suitable for displaying search result lists.
   *
   * @param params - Must include `q`. Optional `limit` and `offset`.
   * @returns Array of matching articles.
   */
  async articles(params: SearchParams): Promise<SearchArticlesResponse> {
    // The API returns a bare array for the simple search endpoint
    const data = await this.client.request<SearchArticlesResponse | unknown[]>('GET', '/search', params);
    // Normalise: if the API returned a bare array, wrap it
    if (Array.isArray(data)) {
      return { results: data as SearchArticlesResponse['results'], total: (data as unknown[]).length };
    }
    return data as SearchArticlesResponse;
  }

  /**
   * Full-text search with snippets and relevance ranking.
   *
   * @param params - Must include `q`. Optional `limit` and `offset`.
   * @returns Search results with snippets and ranking scores.
   */
  async full(params: SearchParams): Promise<SearchFullResponse> {
    return this.client.request<SearchFullResponse>('GET', '/search/full', params);
  }

  /**
   * Autocomplete / typeahead suggestions.
   *
   * @param params - Must include `q`. Optional `limit`.
   * @returns Array of suggestions (entities, categories, etc.).
   */
  async suggest(params: SearchSuggestParams): Promise<SearchSuggestion[]> {
    return this.client.request<SearchSuggestion[]>('GET', '/search/suggest', params);
  }
}
