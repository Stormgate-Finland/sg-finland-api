import {
  OpenAPIRoute,
  OpenAPIRouteSchema,
  Path,
} from "@cloudflare/itty-router-openapi";
import { MatchResponse } from "@/types/players";
import { cacheFetch } from "@/cache";
import { SGWPlayers } from "@/lib/stormgateworld";

export class PlayerLastMatch extends OpenAPIRoute {
  static schema: OpenAPIRouteSchema = {
    tags: ["Players/Matches/Last"],
    summary: "Get the latest match of a player",
    parameters: {
      playerId: Path(String, {
        description: "Player ID",
      }),
    },
    responses: {
      "200": {
        description: "Returns player's latest match",
        schema: {
          success: Boolean,
          error: String,
          result: MatchResponse,
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
    const response = await cacheFetch(SGWPlayers.lastMatch(playerId), context);
    if (response.status !== 200) {
      return {
        success: false,
        error: "Failed to fetch data",
      };
    }
    const body = (await response.json()) as typeof MatchResponse;

    return {
      success: true,
      result: body,
    };
  }
}
