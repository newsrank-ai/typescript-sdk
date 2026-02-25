import type { BaseClient } from './client.js';
import type {
  GetStoryUpdatesParams,
  GetStoryUpdatesResponse,
  ListRankedStoriesParams,
  ListRankedStoriesResponse,
  ListStoriesParams,
  ListStoriesResponse,
  ListStoryDevelopmentsResponse,
  StoryDetail,
} from './types.js';

/**
 * Access stories -- automatically clustered groups of related articles.
 *
 * ```ts
 * const { stories } = await nr.stories.list({ limit: 5 });
 * const story = await nr.stories.get(42);
 * const story = await nr.stories.get('supreme-court-climate-ruling');
 * const ranked = await nr.stories.ranked({ limit: 10 });
 * ```
 */
export class StoriesResource {
  /** @internal */
  constructor(private readonly client: BaseClient) {}

  /**
   * List stories with optional category filter and pagination.
   *
   * @param params - Filtering / pagination options.
   * @returns List of stories.
   */
  async list(params: ListStoriesParams = {}): Promise<ListStoriesResponse> {
    return this.client.request<ListStoriesResponse>('GET', '/stories', params);
  }

  /**
   * List stories ranked by importance / trending score.
   *
   * @param params - Optional limit.
   * @returns Ranked list of stories.
   */
  async ranked(params: ListRankedStoriesParams = {}): Promise<ListRankedStoriesResponse> {
    return this.client.request<ListRankedStoriesResponse>('GET', '/stories/ranked', params);
  }

  /**
   * Get a single story by numeric ID or slug string.
   *
   * @param id - Story ID (number) or slug (string).
   * @returns Full story detail including articles and timeline.
   */
  async get(id: number | string): Promise<StoryDetail> {
    return this.client.request<StoryDetail>('GET', `/stories/${encodeURIComponent(id)}`);
  }

  /**
   * Get the development timeline for a story.
   *
   * @param id - Story ID (number) or slug (string).
   * @returns List of story developments.
   */
  async developments(id: number | string): Promise<ListStoryDevelopmentsResponse> {
    return this.client.request<ListStoryDevelopmentsResponse>(
      'GET',
      `/stories/${encodeURIComponent(id)}/developments`,
    );
  }

  /**
   * Get recent updates for a story since a given timestamp.
   *
   * @param id - Story ID (number) or slug (string).
   * @param params - Must include `since_ms` (epoch milliseconds).
   * @returns List of story updates.
   */
  async updates(id: number | string, params: GetStoryUpdatesParams): Promise<GetStoryUpdatesResponse> {
    return this.client.request<GetStoryUpdatesResponse>(
      'GET',
      `/stories/${encodeURIComponent(id)}/updates`,
      params,
    );
  }
}
