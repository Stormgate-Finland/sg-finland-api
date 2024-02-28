const deafultCache = 60 * 10; // 10 minutes

export async function cacheFetch<T = unknown>(
  request: Request<T>,
  context: ExecutionContext,
  cacheTime: number = deafultCache
) {
  const cacheUrl = new URL(request.url);

  // Construct the cache key from the cache URL
  const cacheKey = new Request(cacheUrl.toString(), request);
  const cache = caches.default;

  let response: Response = await cache.match(cacheKey);

  if (!response) {
    const res = await fetch(request);

    console.log("cacheFetch", res.status, cacheKey.url, cacheTime);
    // Must use Response constructor to inherit all of response's fields
    response = new Response(res.body as ReadableStream<Uint8Array>, res);
    if (res.status !== 200) {
      return response;
    }

    // Any changes made to the response here will be reflected in the cached value
    response.headers.append("Cache-Control", `s-maxage=${cacheTime}`);

    context.waitUntil(cache.put(cacheKey, response.clone()));
  }
  return response;
}
