import { queryString } from "@/utils/query";
import { sgwConfig } from ".";
import { Race } from "./types";

export class SGWPlayers {
  static get = (id: string) => {
    return new Request(`${sgwConfig.apiUrl}/players/${id}`);
  };

  static matches = (
    id: string,
    params?: {
      race?: Race;
      opponent_player_id?: string;
      page?: number;
      count?: number;
    }
  ) => {
    const query = queryString(params);
    return new Request(`${sgwConfig.apiUrl}/players/${id}/matches?${query}`);
  };

  static lastMatch = (id: string) => {
    return new Request(`${sgwConfig.apiUrl}/players/${id}/matches/last`);
  };

  static statisticsActivity = (id: string) => {
    return new Request(`${sgwConfig.apiUrl}/players/${id}/statistics/activity`);
  };

  static statisticsMatchups = (id: string) => {
    return new Request(`${sgwConfig.apiUrl}/players/${id}/statistics/matchups`);
  };

  static statisticsOpponents = (id: string, params?: { count?: number }) => {
    const query = queryString(params);
    return new Request(
      `${sgwConfig.apiUrl}/players/${id}/statistics/opponents?${query}`
    );
  };
}
