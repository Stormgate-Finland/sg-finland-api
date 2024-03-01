import { OpenAPIRouter } from "@cloudflare/itty-router-openapi";

import {
  Countries,
  Activity,
  StatisticsRanked1v1,
} from "@/endpoints/statistics";

export const statisticsRouter = OpenAPIRouter({
  base: "/api/statistics",
});

statisticsRouter.get("/api/statistics/countries", Countries);
statisticsRouter.get("/api/statistics/acticity", Activity);
statisticsRouter.get("/api/statistics/ranked1v1", StatisticsRanked1v1);
