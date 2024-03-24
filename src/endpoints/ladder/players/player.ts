import {
  OpenAPIRoute,
  OpenAPIRouteSchema,
  Path,
} from "@cloudflare/itty-router-openapi";
import { PlayerResponse } from "@/types/players";
import { cacheFetch } from "@/cache";
import { SGWPlayers } from "@/lib/stormgateworld";

export class Player extends OpenAPIRoute {
  static schema: OpenAPIRouteSchema = {
    tags: ["Players/Get player"],
    summary: "Get a single player",
    parameters: {
      playerId: Path(String, {
        description: "Player ID",
      }),
    },
    responses: {
      "200": {
        description: "Returns a player",
        schema: {
          success: Boolean,
          error: String,
          result: PlayerResponse,
        },
      },
    },
  };

  async handle(
    request: Request,
    env: unknown,
    context: ExecutionContext,
    data: Record<string, any>
  ) {
    const { playerId } = data.params;
    return await cacheFetch<typeof PlayerResponse>(
      SGWPlayers.get(playerId),
      context
    );
  }
}
