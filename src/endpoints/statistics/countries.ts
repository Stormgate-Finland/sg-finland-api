import {
  OpenAPIRoute,
  OpenAPIRouteSchema,
  Query,
} from "@cloudflare/itty-router-openapi";
import { StatisticsCountries } from "@/types/types";
import { cacheFetch } from "@/cache";
import { countriesReq } from "@/sgw/api";

export class CountriesList extends OpenAPIRoute {
  static schema: OpenAPIRouteSchema = {
    tags: ["Statistics/Countries"],
    summary: "List number of players in countries",
    parameters: {
      codes: Query(Array(String), {
        description: "Filter by country codes",
        required: false,
      }),
    },
    responses: {
      "200": {
        description: "Returns a list of countries with number of players",
        schema: {
          success: Boolean,
          error: String,
          result: StatisticsCountries,
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
    const response = await cacheFetch(countriesReq(), context);
    if (response.status !== 200) {
      return {
        success: false,
        error: "Failed to fetch data",
      };
    }
    const body = (await response.json()) as typeof StatisticsCountries;

    return {
      success: true,
      result: { ...body, countries: this.filter(body.countries, data.query) },
    };
  }

  private filter(
    data: typeof StatisticsCountries.countries,
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
