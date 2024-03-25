import { OpenAPIRouter } from "@cloudflare/itty-router-openapi";
import {
  StreamLive,
  StreamCreate,
  StreamDelete,
  StreamList,
  StreamUpdate,
  StreamUpsert,
} from "@/endpoints/streams";

export const streamsRouter = OpenAPIRouter({
  base: "/api/streams",
});

streamsRouter.get("/live", StreamLive);
streamsRouter.get("/", StreamList);
streamsRouter.post("/create", StreamCreate);
streamsRouter.post("/upsert", StreamUpsert);
streamsRouter.put("/update/:id", StreamUpdate);
streamsRouter.delete("/delete/:id", StreamDelete);
