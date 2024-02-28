import {
  LeaderboardType,
  League,
  MatchResult,
  MatchState,
  Race,
} from "@/lib/stormgateworld/types";
import {
  DateOnly,
  DateTime,
  Enumeration,
  Int,
  Num,
  Str,
} from "@cloudflare/itty-router-openapi";

export const PlayerResponse = {
  id: String,
  anonymous: Boolean,
  nickname: new Str({ required: false }),
  nickname_discriminator: new Str({ required: false }),
  avatar_url: new Str({ required: false }),
  leaderboard_entries: [
    {
      leaderboard_entry_id: String,
      leaderboard: LeaderboardType,
      player_id: new Str({ required: false }),
      anonymous: Boolean,
      nickname: new Str({ required: false }),
      nickname_discriminator: new Str({ required: false }),
      avatar_url: new Str({ required: false }),
      rank: new Int({ required: false }),
      race: Race,
      league: League,
      tier: new Int({ required: false }),
      mmr: Number,
      max_confirmed_mmr: new Num({ required: false }),
      points: new Num({ required: false }),
      wins: Int,
      losses: Int,
      ties: new Int({ required: false }),
      matches: Int,
      win_rate: Number,
    },
  ],
  last_match_ended_at: new DateTime({ required: false }),
  last_match_started_at: new DateTime({ required: false }),
};

export const MatchResponse = {
  cached_at: DateTime,
  match_id: String,
  state: MatchState,
  leaderboard: LeaderboardType,
  server: String,
  players: [
    {
      player: {
        player_id: String,
        nickname: new Str({ required: false }),
        nickname_discriminator: new Str({ required: false }),
      },
      player_leaderboard_entry: {
        leaderboard_entry_id: String,
        league: League,
        tier: new Int({ required: false }),
        rank: new Int({ required: false }),
        wins: Int,
        losses: Int,
        ties: new Int({ required: false }),
        win_rate: Number,
      },
      race: new Enumeration({
        values: Race,
        enumCaseSensitive: false,
      }),
      team: Int,
      party: Int,
      mmr: Number,
      mmr_updated: new Num({ required: false }),
      mmr_diff: new Num({ required: false }),
      result: MatchResult,
      ping: new Int({ required: false }),
      scores: String,
    },
  ],
  created_at: DateTime,
  ended_at: new DateTime({ required: false }),
  duration: new Int({ required: false }),
};

export const PlayerMatchesResponse = {
  count: Int,
  page: Int,
  total: Int,
  matches: [MatchResponse],
};

export const OpponentsResponse = {
  cached_at: DateTime,
  count: Int,
  opponents: [
    {
      player: {
        player_id: String,
        nickname: new Str({ required: false }),
        nickname_discriminator: new Str({ required: false }),
      },
      matches_count: Int,
      wins_count: Int,
      losses_count: Int,
      wins: Int,
      losses: Int,
      ties: Int,
      win_rate: new Num({ required: false }),
      match_length: {
        max: new Num({ required: false }),
        min: new Num({ required: false }),
        median: new Num({ required: false }),
        average: new Num({ required: false }),
      },
    },
  ],
};

const ActivityDataRanges = {
  max: new Num({ required: false }),
  min: new Num({ required: false }),
  median: new Num({ required: false }),
  average: new Num({ required: false }),
};

const ActivityMatchData = {
  date: new DateOnly({ required: false }),
  race: Race,
  matches: Int,
  wins: Int,
  losses: Int,
  ties: Int,
  win_rate: new Num({ required: false }),
  mmr: ActivityDataRanges,
  points: ActivityDataRanges,
  match_length: ActivityDataRanges,
};

export const PlayerActivityResponse = {
  cached_at: DateTime,
  aggregated: {
    matches: Int,
    wins: Int,
    losses: Int,
    ties: Int,
    win_rate: new Num({ required: false }),
    matches_per_day: ActivityDataRanges,
    mmr: ActivityDataRanges,
    points: ActivityDataRanges,
    match_length: ActivityDataRanges,
  },
  history: [ActivityMatchData],
  races: [
    {
      aggregated: ActivityMatchData,
      history: [ActivityMatchData],
    },
  ],
};

const MatchupData = {
  match_length_range: new Str({ required: false }),
  matches_count: Int,
  wins_count: Int,
  losses_count: Int,
  wins: Int,
  losses: Int,
  ties: Int,
  win_rate: new Num({ required: false }),
  match_length: {
    max: new Num({ required: false }),
    min: new Num({ required: false }),
    median: new Num({ required: false }),
    average: new Num({ required: false }),
  },
};

export const MatchupsResponse = {
  cached_at: new DateTime({ required: true }),
  matchups: [
    {
      race: Race,
      opponent_race: Race,
      aggregated: MatchupData,
      match_length: [MatchupData],
    },
  ],
};
