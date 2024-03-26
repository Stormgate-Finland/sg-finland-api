import { OpenAPIRouter } from "@cloudflare/itty-router-openapi";
import { LeaderboardRanked1v1 } from "@/endpoints/ladder/leaderboards";
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
router.all("/api/streams/*", streamsRouter);

/*
2024-03-23: These endspoints have been disabled by Frost Giant
router.get("/api/ladder/statistics/*", statisticsRouter);
router.get("/api/ladder/players/*", playersRouter);
*/

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
