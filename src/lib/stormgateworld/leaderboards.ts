import { queryString } from "@/utils/query";
import { sgwConfig } from ".";
import { LeaderboardsOrder, Race } from "./types";

export class SGWLeaderboards {
  static ranked1v1 = (params?: {
    race?: Race;
    page?: number;
    count?: number;
    order?: LeaderboardsOrder;
    query?: string;
  }) => {
    const query = queryString(params);
    return new Request(`${sgwConfig.apiUrl}/leaderboards/ranked_1v1?${query}`);
  };
}
