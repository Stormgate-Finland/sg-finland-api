import {
  OpenAPIRoute,
  OpenAPIRouteSchema,
  Path,
  Query,
} from "@cloudflare/itty-router-openapi";
import { OpponentsResponse } from "@/types/players";
import { cacheFetch } from "@/cache";
import { SGWPlayers } from "@/lib/stormgateworld";

export class PlayerOpponents extends OpenAPIRoute {
  static schema: OpenAPIRouteSchema = {
    tags: ["Players/Opponents"],
    summary: "Get the opponents of a player",
    parameters: {
      playerId: Path(String, {
        description: "Player ID",
      }),
      count: Query(Number, {
        description: "Limit the number of results",
        required: false,
      }),
    },
    responses: {
      "200": {
        description: "Returns player's latest match",
        schema: {
          success: Boolean,
          error: String,
          result: OpponentsResponse,
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
      SGWPlayers.statisticsOpponents(playerId, data.query),
      context
    );
    if (response.status !== 200) {
      return {
        success: false,
        error: "Failed to fetch data",
      };
    }
    const body = (await response.json()) as typeof OpponentsResponse;

    return {
      success: true,
      result: body,
    };
  }
}
