import type { BaseClient } from './client.js';
import type {
  GetEntityNetworkParams,
  GetStoryEntityGraphParams,
  GetTopicClusterGraphParams,
  GraphResponse,
} from './types.js';

/**
 * Access knowledge graph endpoints for entity networks, story-entity
 * relationships, and topic clusters.
 *
 * ```ts
 * const network = await nr.graph.entityNetwork({ entity_id: 57, depth: 2 });
 * const storyGraph = await nr.graph.storyEntity({ story_id: 42 });
 * const clusters = await nr.graph.topicCluster({ limit: 10 });
 * ```
 */
export class GraphResource {
  /** @internal */
  constructor(private readonly client: BaseClient) {}

  /**
   * Get the co-occurrence network for an entity.
   *
   * Returns nodes (entities) and edges (co-occurrence relationships)
   * within the specified depth of the target entity.
   *
   * @param params - Must include `entity_id`. Optional `depth` and `limit`.
   * @returns Graph with nodes and edges.
   */
  async entityNetwork(params: GetEntityNetworkParams): Promise<GraphResponse> {
    return this.client.request<GraphResponse>(
      'GET',
      '/graph/entity-network',
      params,
    );
  }

  /**
   * Get the entity graph for a specific story.
   *
   * Returns all entities mentioned across a story's articles and
   * the relationships between them.
   *
   * @param params - Must include `story_id`. Optional `limit`.
   * @returns Graph with nodes and edges.
   */
  async storyEntity(params: GetStoryEntityGraphParams): Promise<GraphResponse> {
    return this.client.request<GraphResponse>(
      'GET',
      '/graph/story-entity',
      params,
    );
  }

  /**
   * Get a topic cluster graph.
   *
   * Groups related stories and articles by topic similarity.
   *
   * @param params - Optional `topic_id` and `limit`.
   * @returns Graph with nodes and edges.
   */
  async topicCluster(params: GetTopicClusterGraphParams = {}): Promise<GraphResponse> {
    return this.client.request<GraphResponse>(
      'GET',
      '/graph/topic-cluster',
      params,
    );
  }
}
