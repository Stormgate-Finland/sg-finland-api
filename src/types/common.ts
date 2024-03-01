import { DateTime, Str } from "@cloudflare/itty-router-openapi";

export const Task = {
  name: new Str({ example: "lorem" }),
  slug: String,
  description: new Str({ required: false }),
  completed: Boolean,
  due_date: new DateTime(),
};

export type ApiResponse<T> =
  | {
      success: true;
      result: T;
    }
  | {
      success: false;
      error: string;
    };
