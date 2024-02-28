import { League, Race } from "@/lib/stormgateworld/types";
import {
  DateOnly,
  DateTime,
  Int,
  Num,
  Obj,
  Str,
} from "@cloudflare/itty-router-openapi";

export const StatisticsCountriesResponse = {
  cached_at: DateTime,
  since: Date,
  until: Date,
  countries: [
    {
      name: new Str({ required: false }),
      code: new Str({ required: false }),
      players: Number,
    },
  ],
};

export const StatisticsActivityResponse = {
  cached_at: DateTime,
  since: DateOnly,
  until: DateOnly,
  activity: {
    aggregated: {
      date: DateOnly,
      matches: Int,
      players: Int,
      match_length_average: Number,
    },
    history: [
      {
        date: DateOnly,
        matches: Int,
        players: Int,
        match_length_average: Number,
      },
    ],
  },
};

const StatisticsRanked1v1RaceData = {
  date: new DateOnly({ required: false }),
  win_rate: new Num({ required: false }),
  win_rate_by_match_length: new Obj(new Object()),
  pick_rate: new Num({ required: false }),
  players_count: new Int({ required: false }),
  matches_count: new Int({ required: false }),
  wins_count: new Int({ required: false }),
  losses_count: new Int({ required: false }),
  matches_count_with_mirror: new Int({ required: false }),
};

const StatisticsRanked1v1MatchLenghData = {
  date: new DateOnly({ required: false }),
  average: new Int({ required: false }),
  median: new Int({ required: false }),
  p70: new Int({ required: false }),
  p90: new Int({ required: false }),
  p95: new Int({ required: false }),
};

export const StatisticsRanked1v1Response = {
  cached_at: DateTime,
  updated_at: DateTime,
  period: String,
  count: Int,
  league: League,
  races: [
    {
      race: Race,
      aggregated: StatisticsRanked1v1RaceData,
      history: [StatisticsRanked1v1RaceData],
    },
  ],
  match_length: {
    aggregated: StatisticsRanked1v1MatchLenghData,
    history: [StatisticsRanked1v1MatchLenghData],
  },
};
