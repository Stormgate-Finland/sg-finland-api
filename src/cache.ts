import { ApiResponse } from "./types/common";
import { getResponseBody } from "./utils/response";

const defaultOptions = { cacheTime: 60 * 10 }; // 10 minutes

export async function cacheFetch<T = unknown>(
  request: Request,
  context: ExecutionContext,
  handler?: (body: T) => ApiResponse<T> | Promise<ApiResponse<T>>,
  options?: typeof defaultOptions
) {
  const cacheUrl = new URL(request.url);
  const cacheTime = options?.cacheTime || defaultOptions.cacheTime;

  // Construct the cache key from the cache URL
  const cacheKey = new Request(cacheUrl.toString(), request);
  const cache = caches.default;

  let response: Response = await cache.match(cacheKey);

  if (!response) {
    const res = await fetch(request);

    const body = await getResponseBody<T>(
      new Response(res.body as ReadableStream<any>, res),
      handler
    );

    // Must use Response constructor to inherit all of response's fields
    response = new Response(JSON.stringify(body), res);

    // Any changes made to the response here will be reflected in the cached value
    response.headers.append("Cache-Control", `s-maxage=${cacheTime}`);

    context.waitUntil(cache.put(cacheKey, response.clone()));
  }
  return response;
}
