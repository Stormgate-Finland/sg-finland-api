import { queryString } from "@/utils/query";
import { sgwConfig } from ".";
import { League } from "./types";

const toDateString = (date?: Date) => {
  return date?.toISOString().split("T")[0] ?? "";
};

export class SGWStatistics {
  static countries = (params?: { since?: Date; until?: Date }) => {
    const query = queryString(params);
    return new Request(`${sgwConfig.apiUrl}/statistics/countries?${query}`);
  };

  static activity = (params?: { since?: Date; until?: Date }) => {
    const query = queryString(params);
    return new Request(`${sgwConfig.apiUrl}/statistics/activity?${query}`);
  };

  static ranked1v1 = (params?: { league?: League; count?: number }) => {
    const query = queryString(params);
    return new Request(`${sgwConfig.apiUrl}/statistics/ranked_1v1?${query}`);
  };

  static servers = (params?: { since?: Date; until?: Date }) => {
    const query = queryString(params);
    return new Request(`${sgwConfig.apiUrl}/statistics/servers?${query}`);
  };
}
