import {
  DataOf,
  OpenAPIRoute,
  OpenAPIRouteSchema,
} from "@cloudflare/itty-router-openapi";
import { cacheResult } from "@/utils/cache";
import {
  StreamLiveResponseType,
  StreamLiveResponse as StreamsLiveResponse,
} from "@/types/streams";
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
        try {
          const streams = await env.DB.prepare(
            "SELECT provider_id FROM streams WHERE provider = 'twitch'"
          ).all<{ provider_id: string }>();
          if (!streams.results) {
            return Response.json({
              success: true,
              result: [],
            });
          }

          const liveStreams = await twitch.getStreams(
            streams.results.map((stream) => stream.provider_id)
          );
          const result = liveStreams.map((stream) => ({
            id: stream.id,
            name: stream.user_name,
            title: stream.title,
            viewers: stream.viewer_count,
            thumbnailUrl: Twitch.getTwitchThumbnail(stream.thumbnail_url),
            url: Twitch.getChannelUrl(stream.user_login),
          }));
          return Response.json({
            success: true,
            result,
          });
        } catch (error) {
          return Response.json({
            success: false,
            error: error.message,
          });
        }
      },
      { cacheTime: 60 * 3 }
    );
  }
}
