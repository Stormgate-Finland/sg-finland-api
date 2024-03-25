import { DataOf, OpenAPIRoute, Path } from "@cloudflare/itty-router-openapi";
import { z } from "zod";
import { Env } from "@/types/common";

export class StreamDelete extends OpenAPIRoute {
  static schema = {
    tags: ["Streams/Delete"],
    summary: "Delete existing Stream",
    parameters: {
      id: Path(z.string(), {
        description: "Stream id",
        pattern: /\d+/,
      }),
    },
    responses: {
      "200": {
        description: "Returns status if stream was deleted",
        schema: {
          success: Boolean,
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
    data: DataOf<typeof StreamDelete.schema>
  ) {
    const id = Number(data.params.id);

    try {
      const info = await env.DB.prepare("DELETE FROM streams WHERE id = ?")
        .bind(id)
        .run();
      if (info?.meta?.changes === 0) {
        return Response.json(
          {
            success: false,
            error: "Stream not found",
          },
          { status: 404 }
        );
      }
    } catch (e: any) {
      console.error(e);
      return Response.json(
        {
          success: false,
          error: "Stream delete failed",
        },
        { status: 500 }
      );
    }

    return {
      success: true,
    };
  }
}
