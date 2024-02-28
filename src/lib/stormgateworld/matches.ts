import { queryString } from "@/utils/query";
import { sgwConfig } from ".";
import { MatchState } from "./types";

export class SGWMatches {
  static get = (params?: {
    page?: number;
    count?: number;
    state?: MatchState;
  }) => {
    const query = queryString(params);
    return new Request(`${sgwConfig.apiUrl}/matches?${query}`);
  };
}
