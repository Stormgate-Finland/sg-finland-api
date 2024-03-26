import {
  Enumeration,
  OpenAPIRoute,
  OpenAPIRouteSchema,
  Query,
} from "@cloudflare/itty-router-openapi";
import { StatisticsRanked1v1Response } from "@/types/statistics";
import { cacheFetch } from "@/utils/cache";
import { SGWStatistics } from "@/lib/stormgateworld";
import { League } from "@/lib/stormgateworld/types";

export class StatisticsRanked1v1 extends OpenAPIRoute {
  static schema: OpenAPIRouteSchema = {
    tags: ["Statistics/Ranked1v1"],
    summary: "Get daily match and player counts",
    parameters: {
      race: Query(Enumeration, {
        description: "Filter maches by league",
        enumCaseSensitive: false,
        required: false,
        values: Object.values(League),
      }),
      count: Query(Number, {
        description: "Limit the number of results",
        required: false,
      }),
    },
    responses: {
      "200": {
        description:
          "Returns a historical list of days with match and player counts and matter length averages",
        schema: {
          success: Boolean,
          error: String,
          result: StatisticsRanked1v1Response,
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
    return await cacheFetch<typeof StatisticsRanked1v1Response>(
      SGWStatistics.ranked1v1(data.query),
      context
    );
  }
}
