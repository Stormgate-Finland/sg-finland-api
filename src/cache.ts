import { ApiResponse } from "./types/common";
import { getResponseBody } from "./utils/response";

const defaultOptions = { cacheTime: 60 * 10 }; // 10 minutes

const getCacheKey = (request: Request) => {
  const url = new URL(request.url);

  // Construct the cache key from the cache URL
  const cacheKey = new Request(url.toString(), request);
  return cacheKey;
};

// Fetch request and cache it
export async function cacheFetch<T = unknown>(
  request: Request,
  context: ExecutionContext,
  bodyHandler?: (body: T) => ApiResponse<T> | Promise<ApiResponse<T>>,
  options?: typeof defaultOptions
) {
  const cacheTime = options.cacheTime || defaultOptions.cacheTime;
  const cacheKey = getCacheKey(request);
  const cache = caches.default;

  let response: Response = await cache.match(cacheKey);

  if (!response) {
    const res = await fetch(request);

    const body = await getResponseBody<T>(
      new Response(res.body as ReadableStream<any>, res),
      bodyHandler
    );

    // Must use Response constructor to inherit all of response's fields
    response = new Response(JSON.stringify(body), res);

    // Any changes made to the response here will be reflected in the cached value
    response.headers.append("Cache-Control", `s-maxage=${cacheTime}`);
    context.waitUntil(cache.put(cacheKey, response.clone()));
  }
  return response;
}

// Cache the response of custom event handler
export async function cacheResult<T = unknown>(
  request: Request,
  context: ExecutionContext,
  handler?: () => ApiResponse<T> | Promise<ApiResponse<T>>,
  options?: typeof defaultOptions
) {
  const cacheTime = options.cacheTime || defaultOptions.cacheTime;
  const cacheKey = getCacheKey(request);
  const cache = caches.default;

  let response: Response = await cache.match(cacheKey);

  if (!response) {
    const body = await handler();

    response = new Response(JSON.stringify(body));
    response.headers.append("Cache-Control", `s-maxage=${cacheTime}`);
    context.waitUntil(cache.put(cacheKey, response.clone()));
  }
  return response;
}
