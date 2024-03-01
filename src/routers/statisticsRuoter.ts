import { OpenAPIRouter } from "@cloudflare/itty-router-openapi";

import {
  Countries,
  Activity,
  StatisticsRanked1v1,
} from "@/endpoints/statistics";

export const statisticsRouter = OpenAPIRouter({
  base: "/api/statistics",
});

statisticsRouter.get("/countries", Countries);
statisticsRouter.get("/acticity", Activity);
statisticsRouter.get("/ranked1v1", StatisticsRanked1v1);
