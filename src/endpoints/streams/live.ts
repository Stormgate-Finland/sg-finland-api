import {
  DataOf,
  OpenAPIRoute,
  OpenAPIRouteSchema,
} from "@cloudflare/itty-router-openapi";
import { cacheResult } from "@/utils/cache";
import { StreamLiveResponse as StreamsLiveResponse } from "@/types/streams";
import { Env } from "@/types/common";
import { Twitch } from "@/lib/twitch/client";

export class StreamLive extends OpenAPIRoute {
  static schema: OpenAPIRouteSchema = {
    tags: ["Streams/Live"],
    summary: "Get live streams",
    responses: {
      "200": {
        description:
          "Returns a list of live streams that are streaming Stormgate",
        schema: {
          success: Boolean,
          error: String,
          result: StreamsLiveResponse,
        },
      },
    },
  };

  async handle(
    request: Request,
    env: Env,
    context: ExecutionContext,
    data: DataOf<typeof StreamLive.schema>
  ) {
    return await cacheResult(
      request,
      context,
      async () => {
        const twitch = new Twitch(env);
        type StreamRow = { id: number; provider: string; provider_id: string };
        try {
          const streams = await env.DB.prepare(
            "SELECT id, provider, provider_id FROM streams WHERE provider = 'twitch'"
          ).all<StreamRow>();
          if (!streams.results) {
            return Response.json(
              {
                success: true,
                result: [],
              },
              { status: 200 }
            );
          }
          const liveStreams = await twitch.getStreams(
            streams.results.map((stream) => stream.provider_id)
          );
          const result = liveStreams.map((liveStream) => {
            const dbStream: StreamRow | undefined = streams.results.find(
              (s) =>
                s.provider_id === liveStream.user_login &&
                s.provider === "twitch"
            );
            return {
              id: dbStream?.id,
              name: liveStream.user_name,
              title: liveStream.title,
              viewers: liveStream.viewer_count,
              thumbnailUrl: Twitch.getTwitchThumbnail(liveStream.thumbnail_url),
              url: Twitch.getChannelUrl(liveStream.user_login),
            };
          });
          return Response.json(
            {
              success: true,
              result,
            },
            { status: 200 }
          );
        } catch (error) {
          return Response.json(
            {
              success: false,
              error: error.message,
            },
            { status: 500 }
          );
        }
      },
      { cacheTime: 60 * 3 }
    );
  }
}
