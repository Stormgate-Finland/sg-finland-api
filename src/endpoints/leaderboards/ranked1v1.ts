import {
  Enumeration,
  OpenAPIRoute,
  OpenAPIRouteSchema,
  Query,
} from "@cloudflare/itty-router-openapi";
import { LeaderboardResponse } from "@/types/leaderboards";
import { cacheFetch } from "@/cache";
import { SGWLeaderboards } from "@/lib/stormgateworld";
import { LeaderboardsOrder, Race } from "@/lib/stormgateworld/types";

export class LeaderboardRanked1v1 extends OpenAPIRoute {
  static schema: OpenAPIRouteSchema = {
    tags: ["Leaderboards/Ranked 1v1"],
    summary: "List ranked 1v1 match leaderboards",
    parameters: {
      race: Query(Enumeration, {
        description: "Filter by race",
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
      order: Query(Enumeration, {
        description: "Set the order of the results",
        enumCaseSensitive: false,
        required: false,
        values: Object.values(LeaderboardsOrder),
      }),
      query: Query(String, {
        description: "Free text search",
        required: false,
      }),
    },
    responses: {
      "200": {
        description: "Returns a list of players in the 1v1 ranked leaderboard",
        schema: {
          success: Boolean,
          error: String,
          result: LeaderboardResponse,
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
    const response = await cacheFetch(
      SGWLeaderboards.ranked1v1(data.query),
      context
    );
    if (response.status !== 200) {
      return {
        success: false,
        error: "Failed to fetch data",
      };
    }
    const body = (await response.json()) as typeof LeaderboardResponse;

    return {
      success: true,
      result: body,
    };
  }
}
