import { OpenAPIRouter } from "@cloudflare/itty-router-openapi";
// import { TaskList, TaskCreate, TaskFetch, TaskDelete } from "@/endpoints/tasks";
import {
  Countries,
  Activity,
  StatisticsRanked1v1,
} from "@/endpoints/statistics";
import { LeaderboardRanked1v1 } from "@/endpoints/leaderboards";
import {
  Player,
  PlayerActivity,
  PlayerLastMatch,
  PlayerMatches,
  PlayerMatchups,
  PlayerOpponents,
} from "@/endpoints/players";

export const router = OpenAPIRouter({
  docs_url: "/",
});

// router.get("/api/tasks/", TaskList);
// router.post("/api/tasks/", TaskCreate);
// router.get("/api/tasks/:taskSlug/", TaskFetch);
// router.delete("/api/tasks/:taskSlug/", TaskDelete);

router.get("/api/statistics/countries", Countries);
router.get("/api/statistics/acticity", Activity);
router.get("/api/statistics/ranked1v1", StatisticsRanked1v1);

router.get("/api/leaderboard/1v1", LeaderboardRanked1v1);

router.get("/api/players/:playerId", Player);
router.get("/api/players/:playerId/matches", PlayerMatches);
router.get("/api/players/:playerId/matches/last", PlayerLastMatch);
router.get("/api/players/:playerId/statistics/opponents", PlayerOpponents);
router.get("/api/players/:playerId/statistics/activity", PlayerActivity);
router.get("/api/players/:playerId/statistics/matchups", PlayerMatchups);

// 404 for everything else
router.all("*", () =>
  Response.json(
    {
      success: false,
      error: "Route not found",
    },
    { status: 404 }
  )
);

export default {
  fetch: router.handle,
} satisfies ExportedHandler;
