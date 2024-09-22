import { queryString } from "@/utils/query";
import { untappedConfig } from ".";

export class UntappedLeaderboard {
  static leaderboard = (
    params: {
      match_mode: "ranked_1v1";
    } = { match_mode: "ranked_1v1" }
  ) => {
    const query = queryString(params);
    return new Request(`${untappedConfig.apiUrl}/leaderboard/?${query}`);
  };
}
