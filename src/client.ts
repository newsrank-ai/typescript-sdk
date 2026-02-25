// ---------------------------------------------------------------------------
// Base HTTP client with auth, error handling, and query-string helpers
// ---------------------------------------------------------------------------

export class NewsRankError extends Error {
  /** HTTP status code returned by the API. */
  readonly status: number;
  /** Raw response body (may be JSON-parsed or a plain string). */
  readonly body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = 'NewsRankError';
    this.status = status;
    this.body = body;
  }
}

export interface ClientOptions {
  apiKey: string;
  baseUrl: string;
  fetch: typeof globalThis.fetch;
  timeout: number;
}

export class BaseClient {
  private readonly apiKey: string;
  private readonly baseUrl: string;
  private readonly _fetch: typeof globalThis.fetch;
  private readonly timeout: number;

  constructor(options: ClientOptions) {
    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl.replace(/\/+$/, '');
    this._fetch = options.fetch;
    this.timeout = options.timeout;
  }

  // -------------------------------------------------------------------------
  // Public request method used by all resource classes
  // -------------------------------------------------------------------------

  async request<T>(
    method: string,
    path: string,
    params?: Record<string, unknown> | object,
  ): Promise<T> {
    const url = this.buildUrl(path, params as Record<string, unknown> | undefined);

    const headers: Record<string, string> = {
      Accept: 'application/json',
    };

    if (this.apiKey) {
      headers['Authorization'] = `Bearer ${this.apiKey}`;
    }

    const init: RequestInit = { method, headers };

    // Attach an AbortController-based timeout when supported
    if (this.timeout > 0) {
      const controller = new AbortController();
      init.signal = controller.signal;
      setTimeout(() => controller.abort(), this.timeout);
    }

    let response: Response;
    try {
      response = await this._fetch(url, init);
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        throw new NewsRankError(
          `Request to ${path} timed out after ${this.timeout}ms`,
          0,
          null,
        );
      }
      throw err;
    }

    // Attempt to parse body regardless of status so callers get error detail
    let body: unknown;
    const contentType = response.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      body = await response.json();
    } else {
      body = await response.text();
    }

    if (!response.ok) {
      const msg =
        typeof body === 'object' && body !== null && 'message' in body
          ? String((body as Record<string, unknown>).message)
          : typeof body === 'string'
            ? body
            : `HTTP ${response.status}`;
      throw new NewsRankError(msg, response.status, body);
    }

    return body as T;
  }

  // -------------------------------------------------------------------------
  // Internal helpers
  // -------------------------------------------------------------------------

  private buildUrl(
    path: string,
    params?: Record<string, unknown>,
  ): string {
    const url = new URL(`${this.baseUrl}${path}`);
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
          url.searchParams.set(key, String(value));
        }
      }
    }
    return url.toString();
  }
}
