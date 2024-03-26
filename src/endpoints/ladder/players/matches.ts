import {
  Enumeration,
  OpenAPIRoute,
  OpenAPIRouteSchema,
  Path,
  Query,
} from "@cloudflare/itty-router-openapi";
import { PlayerMatchesResponse } from "@/types/players";
import { cacheFetch } from "@/utils/cache";
import { SGWPlayers } from "@/lib/stormgateworld";
import { Race } from "@/lib/stormgateworld/types";

export class PlayerMatches extends OpenAPIRoute {
  static schema: OpenAPIRouteSchema = {
    tags: ["Players/Matches"],
    summary: "Get the matches of a player",
    parameters: {
      playerId: Path(String, {
        description: "Player ID",
      }),
      race: Query(Enumeration, {
        description: "Filter maches by race",
        enumCaseSensitive: false,
        required: false,
        values: Object.values(Race),
      }),
      page: Query(Number, {
        description: "Skip to page",
        required: false,
      }),
      count: Query(Number, {
        description: "Limit the number of results",
        required: false,
      }),
      opponent_player_id: Query(String, {
        description: "Filter by opponent player ID",
        required: false,
      }),
    },
    responses: {
      "200": {
        description: "Returns player's matches",
        schema: {
          success: Boolean,
          error: String,
          result: PlayerMatchesResponse,
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
    return await cacheFetch<typeof PlayerMatchesResponse>(
      SGWPlayers.matches(playerId, data.query),
      context
    );
  }
}
