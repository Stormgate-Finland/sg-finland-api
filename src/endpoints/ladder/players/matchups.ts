import {
  OpenAPIRoute,
  OpenAPIRouteSchema,
  Path,
} from "@cloudflare/itty-router-openapi";
import { MatchupsResponse } from "@/types/players";
import { cacheFetch } from "@/utils/cache";
import { SGWPlayers } from "@/lib/stormgateworld";

export class PlayerMatchups extends OpenAPIRoute {
  static schema: OpenAPIRouteSchema = {
    tags: ["Players/Matchups"],
    summary: "Get the matchups of a player",
    parameters: {
      playerId: Path(String, {
        description: "Player ID",
      }),
    },
    responses: {
      "200": {
        description: "Returns player's matchups statiscits",
        schema: {
          success: Boolean,
          error: String,
          result: MatchupsResponse,
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
    return await cacheFetch<typeof MatchupsResponse>(
      SGWPlayers.statisticsMatchups(playerId),
      context
    );
  }
}
