import {
  OpenAPIRoute,
  OpenAPIRouteSchema,
  Path,
} from "@cloudflare/itty-router-openapi";
import { PlayerActivityResponse } from "@/types/players";
import { cacheFetch } from "@/utils/cache";
import { SGWPlayers } from "@/lib/stormgateworld";

export class PlayerActivity extends OpenAPIRoute {
  static schema: OpenAPIRouteSchema = {
    tags: ["Players/Activity"],
    summary: "Get the activity of a player",
    parameters: {
      playerId: Path(String, {
        description: "Player ID",
      }),
    },
    responses: {
      "200": {
        description: "Returns player's match activity",
        schema: {
          success: Boolean,
          error: String,
          result: PlayerActivityResponse,
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
    return await cacheFetch<typeof PlayerActivityResponse>(
      SGWPlayers.statisticsActivity(playerId),
      context
    );
  }
}
