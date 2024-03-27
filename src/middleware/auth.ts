import { Env } from "@/types/common";
import { safelyCompare } from "@/utils/helpers";

export async function authenticateRequest(
  request: Request,
  env: Env,
  context: any
) {
  if (!env.API_KEY) {
    return;
  }
  const apiKey = request.headers.get("api_key") ?? "";
  const validKey = safelyCompare(apiKey, env.API_KEY);

  if (!validKey) {
    return Response.json(
      {
        success: false,
        errors: "Authentication error",
      },
      {
        status: 401,
      }
    );
  }
}
