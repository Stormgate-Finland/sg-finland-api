import {
  OpenAPIRoute,
  OpenAPIRouteSchema,
  Query,
} from "@cloudflare/itty-router-openapi";
import { StatisticsActivityResponse } from "@/types/statistics";
import { cacheFetch } from "@/cache";
import { SGWStatistics } from "@/lib/stormgateworld";

export class Activity extends OpenAPIRoute {
  static schema: OpenAPIRouteSchema = {
    tags: ["Statistics/Activity"],
    summary: "Get daily match and player counts",
    parameters: {
      since: Query(Date, {
        description: "Show activity since this date",
        required: false,
      }),
      until: Query(Date, {
        description: "Show activity until this date",
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
          result: StatisticsActivityResponse,
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
    return await cacheFetch<typeof StatisticsActivityResponse>(
      SGWStatistics.activity(data.query),
      context
    );
  }
}
