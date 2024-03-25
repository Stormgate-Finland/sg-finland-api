import { DataOf, OpenAPIRoute } from "@cloudflare/itty-router-openapi";
import {
  StreamResponse,
  StreamCreateRequest,
  StreamResponseType,
} from "@/types/streams";
import { Env } from "@/types/common";
import { Twitch } from "@/lib/twitch/client";

export class StreamUpsert extends OpenAPIRoute {
  static schema = {
    tags: ["Streams/Upsert"],
    summary: "Create a new Stream or update an existing one",
    requestBody: StreamCreateRequest,
    responses: {
      "200": {
        description: "Returns the created/updated stream",
        schema: {
          success: Boolean,
          result: StreamResponse,
        },
      },
      "404": {
        description: "Stream not found from external API",
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
    data: DataOf<typeof StreamUpsert.schema>
  ) {
    const { body } = data;

    // Check if stream already exists
    const result = await env.DB.prepare("SELECT id FROM streams WHERE id = ?")
      .bind(body.id)
      .first<{ id: number }>();
    const isExistingStream = !!result?.id;

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

    const newStream = {
      id: body.id,
      url: streamDetails.url,
      avatarUrl: streamDetails.avatarUrl,
      providerId: streamDetails.providerId,
      provider: streamDetails.provider,
    };

    try {
      if (isExistingStream) {
        await this.updateStream(env, newStream);
      } else {
        await this.insertStream(env, newStream);
      }
    } catch (e: any) {
      console.error(e);
      return Response.json(
        {
          success: false,
          error: "Stream insert failed",
        },
        { status: 409 }
      );
    }

    return {
      success: true,
      result: newStream,
    };
  }

  private async insertStream(env: Env, stream: StreamResponseType) {
    await env.DB.prepare(
      "INSERT INTO streams (id, provider_id, provider, url, avatar_url) VALUES (?, ?, ?, ?, ?)"
    )
      .bind(
        stream.id,
        stream.providerId,
        stream.provider,
        stream.url ?? null,
        stream.avatarUrl ?? null
      )
      .run();
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
