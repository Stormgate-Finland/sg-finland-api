import { DataOf, OpenAPIRoute, Path } from "@cloudflare/itty-router-openapi";
import {
  StreamResponse,
  StreamResponseType,
  StreamUpdateRequest,
} from "@/types/streams";
import { z } from "zod";
import { Env } from "@/types/common";
import { Twitch } from "@/lib/twitch/client";

export class StreamUpdate extends OpenAPIRoute {
  static schema = {
    tags: ["Streams/Update"],
    summary: "Update existing Stream",
    parameters: {
      id: Path(z.number().int(), {
        description: "Stream id",
      }),
    },
    requestBody: StreamUpdateRequest,
    responses: {
      "200": {
        description: "Returns the updated stream",
        schema: {
          success: Boolean,
          result: StreamResponse,
        },
      },
      "404": {
        description: "Stream not found",
        schema: {
          success: Boolean,
          error: String,
        },
      },
    },
  };

  async handle(
    request: Request,
    env: Env,
    context: ExecutionContext,
    data: DataOf<typeof StreamUpdate.schema>
  ) {
    const { id } = data.params;
    const { body } = data;

    if ((await this.streamExists(env, id)) === false) {
      return Response.json(
        {
          success: false,
          error: "Stream not found",
        },
        { status: 404 }
      );
    }

    // Twitch only for now, TODO youtube
    const twitch = new Twitch(env);
    const streamDetails = await twitch.getStreamDetails(body.url);
    if (!streamDetails) {
      return Response.json(
        {
          success: false,
          error: "Uknown stream, stream details not found",
        },
        { status: 404 }
      );
    }

    const updatedStream = {
      id,
      url: streamDetails.url,
      avatarUrl: streamDetails.avatarUrl,
      providerId: streamDetails.providerId,
      provider: streamDetails.provider,
    };

    try {
      await this.updateStream(env, updatedStream);
    } catch (e: any) {
      console.error(e);
      return Response.json(
        {
          success: false,
          error: "Stream update failed",
        },
        { status: 500 }
      );
    }

    return {
      success: true,
      result: updatedStream,
    };
  }

  private async streamExists(env: Env, id: number) {
    const result = await env.DB.prepare("SELECT id FROM streams WHERE id = ?")
      .bind(id)
      .first<{ id: number }>();
    return !!result?.id;
  }

  private async updateStream(env: Env, stream: StreamResponseType) {
    const info = await env.DB.prepare(
      "UPDATE streams SET provider_id = ?, provider = ?, url = ?, avatar_url = ? WHERE id = ?"
    )
      .bind(
        stream.providerId,
        stream.provider,
        stream.url ?? null,
        stream.avatarUrl ?? null,
        stream.id
      )
      .run();
  }
}
