import {
  OpenAPIRoute,
  OpenAPIRouteSchema,
  Path,
} from "@cloudflare/itty-router-openapi";
import { MatchupsResponse } from "@/types/players";
import { cacheFetch } from "@/cache";
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
    const response = await cacheFetch(
      SGWPlayers.statisticsMatchups(playerId),
      context
    );
    if (response.status !== 200) {
      return {
        success: false,
        error: "Failed to fetch data",
      };
    }
    const body = (await response.json()) as typeof MatchupsResponse;

    return {
      success: true,
      result: body,
    };
  }
}