import { ApiResponse } from "@/types/common";

export async function getResponseBody<T>(
  res: Response,
  handler?: (body: T) => ApiResponse<T> | Promise<ApiResponse<T>>
) {
  if (res.status !== 200) {
    return {
      success: false,
      error: "Failed to fetch data",
    };
  }

  const body = await res.json();

  if (handler) {
    return await handler(body as T);
  }
  return {
    success: true,
    result: body,
  };
}
