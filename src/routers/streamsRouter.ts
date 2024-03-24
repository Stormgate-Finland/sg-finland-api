import { OpenAPIRouter } from "@cloudflare/itty-router-openapi";
import {
  StreamLive,
  StreamCreate,
  StreamDelete,
  StreamList,
  StreamUpdate,
} from "@/endpoints/streams";

export const streamsRouter = OpenAPIRouter({
  base: "/api/streams",
});

streamsRouter.get("/live", StreamLive);
streamsRouter.get("/", StreamList);
streamsRouter.post("/create", StreamCreate);
streamsRouter.put("/update/:id", StreamUpdate);
streamsRouter.delete("/update/:id", StreamDelete);
