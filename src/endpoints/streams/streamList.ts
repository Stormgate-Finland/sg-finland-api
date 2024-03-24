import { DataOf, OpenAPIRoute } from "@cloudflare/itty-router-openapi";
import { StreamListResponse } from "@/types/streams";
import { Env } from "@/types/common";
import { cacheResult } from "@/cache";

export class StreamList extends OpenAPIRoute {
  static schema = {
    tags: ["Streams/List"],
    summary: "List existing Streams",
    responses: {
      "200": {
        description: "Returns the list of streams",
        schema: {
          success: Boolean,
          result: StreamListResponse,
        },
      },
    },
  };

  async handle(
    request: Request,
    env: Env,
    context: ExecutionContext,
    data: DataOf<typeof StreamList.schema>
  ) {
    return await cacheResult(
      request,
      context,
      //@ts-ignore TODO: Fix this
      async () => {
        try {
          const streams = await env.DB.prepare(
            "SELECT id, provider_id, provider, url FROM streams"
          ).all<{
            id: number;
            provider_id: string;
            provider: string;
            url: string;
          }>();

          return {
            success: true,
            result: streams?.results ?? [],
          };
        } catch (error) {
          return {
            success: false,
            error: error.message,
          };
        }
      },
      { cacheTime: 60 * 3 }
    );
  }
}
