import { OpenAPIRouter } from "@cloudflare/itty-router-openapi";
import { TaskList, TaskCreate, TaskFetch, TaskDelete } from "@/endpoints/tasks";
import { CountriesList } from "@/endpoints/statistics";

export const router = OpenAPIRouter({
  docs_url: "/",
});

router.get("/api/tasks/", TaskList);
router.post("/api/tasks/", TaskCreate);
router.get("/api/tasks/:taskSlug/", TaskFetch);
router.delete("/api/tasks/:taskSlug/", TaskDelete);

router.get("/api/statistics/countries", CountriesList);

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
