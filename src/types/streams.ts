import { z } from "zod";

export const StreamLiveResponse = z.array(
  z.object({
    id: z.number().int(),
    name: z.string(),
    title: z.string(),
    viewers: z.number().int(),
    thumbnailUrl: z.string().optional(),
    url: z.string(),
  })
);
export type StreamLiveResponseType = z.infer<typeof StreamLiveResponse>;

export const StreamCreateRequest = z
  .object({
    id: z.number().int(),
    url: z.string(),
  })
  .required();
export type StreamCreateRequestType = z.infer<typeof StreamCreateRequest>;

export const StreamUpdateRequest = z
  .object({
    url: z.string(),
  })
  .required();
export type StreamUpdateRequestType = z.infer<typeof StreamUpdateRequest>;

export const StreamType = z.enum(["twitch", "youtube"]);

export const StreamResponse = z.object({
  id: z.number().int(),
  providerId: z.string(),
  provider: StreamType,
  avatarUrl: z.string().optional(),
  url: z.string(),
});
export type StreamResponseType = z.infer<typeof StreamResponse>;

export const StreamListResponse = z.object({
  id: z.number().int(),
  providerId: z.string(),
  provider: StreamType,
  url: z.string(),
});
export type StreamListResponseType = z.infer<typeof StreamListResponse>;
