import { OpenAPIRouter } from "@cloudflare/itty-router-openapi";
// import { TaskList, TaskCreate, TaskFetch, TaskDelete } from "@/endpoints/tasks";

import { LeaderboardRanked1v1 } from "@/endpoints/leaderboards";
import { playersRouter } from "./routers/playersRouter";
import { statisticsRouter } from "./routers/statisticsRuoter";

export const router = OpenAPIRouter({
  docs_url: "/",
});

// router.get("/api/tasks/", TaskList);
// router.post("/api/tasks/", TaskCreate);
// router.get("/api/tasks/:taskSlug/", TaskFetch);
// router.delete("/api/tasks/:taskSlug/", TaskDelete);

router.get("/api/leaderboard/1v1", LeaderboardRanked1v1);
router.get("/api/statistics/*", statisticsRouter);
router.get("/api/players/*", playersRouter);

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
