import {
  OpenAPIRoute,
  OpenAPIRouteSchema,
  Query,
} from "@cloudflare/itty-router-openapi";
import { StatisticsCountriesResponse } from "@/types/statistics";
import { cacheFetch } from "@/utils/cache";
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
    return await cacheFetch<typeof StatisticsCountriesResponse>(
      SGWStatistics.countries(data.query),
      context,
      (body) => {
        return {
          success: true,
          result: {
            ...body,
            countries: this.filter(body.countries, data.query),
          },
        };
      }
    );
  }

  private filter(
    data: typeof StatisticsCountriesResponse.countries,
    query: Record<string, any>
  ) {
    const { codes } = query;
    let filteredData = data;
    if (codes) {
      const upperCodes = codes.map((code: string) => code.toUpperCase());
      filteredData = data.filter((country) =>
        upperCodes.includes(country.code)
      );
      if (codes.includes("NULL")) {
        filteredData.push(data.find((country) => country.code === null));
      }
    }
    return filteredData;
  }
}
