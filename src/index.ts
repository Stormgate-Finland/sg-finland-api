import { OpenAPIRouter } from "@cloudflare/itty-router-openapi";
import { LeaderboardRanked1v1 } from "@/endpoints/ladder/leaderboards";
import { playersRouter } from "./routers/playersRouter";
import { statisticsRouter } from "./routers/statisticsRouter";
import { streamsRouter } from "./routers/streamsRouter";
import { authenticateRequest } from "./middleware/auth";

export const router = OpenAPIRouter({
  docs_url: "/",
  schema: {
    security: [
      {
        apiKeyAuth: [],
      },
    ],
  },
});
router.registry.registerComponent("securitySchemes", "apiKeyAuth", {
  type: "apiKey",
  name: "api_key",
  in: "header",
});

// Middleware
router.all("/api/*", authenticateRequest);

// Routes
router.get("/api/ladder/leaderboard/1v1", LeaderboardRanked1v1);
router.get("/api/ladder/statistics/*", statisticsRouter);
router.get("/api/ladder/players/*", playersRouter);
router.all("/api/streams/*", streamsRouter);

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
