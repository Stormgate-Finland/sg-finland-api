import {
  OpenAPIRoute,
  OpenAPIRouteSchema,
  Query,
} from "@cloudflare/itty-router-openapi";
import { StatisticsCountriesResponse } from "@/types/statistics";
import { cacheFetch } from "@/cache";
import { SGWStatistics } from "@/lib/stormgateworld";

export class Countries extends OpenAPIRoute {
  static schema: OpenAPIRouteSchema = {
    tags: ["Statistics/Countries"],
    summary: "List number of players in countries",
    parameters: {
      codes: Query(Array(String), {
        description: "Filter by country codes",
        required: false,
      }),
      since: Query(Date, {
        description: "Show stats since this date",
        required: false,
      }),
      until: Query(Date, {
        description: "Show stats until this date",
        required: false,
      }),
    },
    responses: {
      "200": {
        description: "Returns a list of countries with number of players",
        schema: {
          success: Boolean,
          error: String,
          result: StatisticsCountriesResponse,
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
      SGWStatistics.countries(data.query),
      context
    );
    if (response.status !== 200) {
      return {
        success: false,
        error: "Failed to fetch data",
      };
    }
    const body = (await response.json()) as typeof StatisticsCountriesResponse;

    return {
      success: true,
      result: { ...body, countries: this.filter(body.countries, data.query) },
    };
  }

  private filter(
    data: typeof StatisticsCountriesResponse.countries,
    query: Record<string, any>
  ) {
    const { codes } = query;
    let filteredData = data;
    if (codes) {
      filteredData = data.filter((country) => codes.includes(country.code));
      if (codes.includes("NULL")) {
        filteredData.push(data.find((country) => country.code === null));
      }
    }
    return filteredData;
  }
}
