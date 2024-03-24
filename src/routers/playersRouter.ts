import { OpenAPIRouter } from "@cloudflare/itty-router-openapi";
import {
  Player,
  PlayerActivity,
  PlayerLastMatch,
  PlayerMatches,
  PlayerMatchups,
  PlayerOpponents,
} from "@/endpoints/ladder/players";

export const playersRouter = OpenAPIRouter({
  base: "/api/ladder/players",
});

playersRouter.get("/:playerId", Player);
playersRouter.get("/:playerId/matches", PlayerMatches);
playersRouter.get("/:playerId/matches/last", PlayerLastMatch);
playersRouter.get("/:playerId/statistics/opponents", PlayerOpponents);
playersRouter.get("/:playerId/statistics/activity", PlayerActivity);
playersRouter.get("/:playerId/statistics/matchups", PlayerMatchups);
