export enum League {
  Aspirant = "aspirant",
  Bronze = "bronze",
  Silver = "silver",
  Gold = "gold",
  Platinum = "platinum",
  Diamond = "diamond",
  Master = "master",
}

export type Rank = {
  league: League;
  losses: number;
  mmr: number;
  points: number;
  season: number;
  tier: number;
  ties: number | null;
  wins: number;
};

export type ProfileRanks = {
  ranked_1v1: Record<Race, Rank>;
};

export type Profile = {
  ranks: ProfileRanks;
  playerName: string;
  profileId: string;
};

export enum Race {
  Infernals = "infernals",
  Vanguard = "vanguard",
  Celestials = "celestials",
}

export type LeaderboardPlayer = {
  league: League;
  losses: number;
  mmr: number;
  points: number;
  race: Race;
  tier: number;
  ties: number | null;
  wins: number;
  playerName: string;
  profileId: string;
};

export type MetaPeriod = {
  id: number;
  description: string;
  match_mode: string;
  start_client_version: string;
  start_ts: string;
  end_ts: string | null;
};

export type PlayerStats = {
  all: Stats;
  [key: MetaPeriod["id"]]: Stats;
};

export type Stats = {
  recent_mmr_history: number[];
  outcomes_by_duration: Record<Race, StatsOutcomeByDuration[]>;
  outcomes_by_opponent: StatsOutcomeByOpponent[];
  outcomes_by_opponent_race: Record<Race, StatsOutcomeByOpponentRace>;
  outcomes_by_map: Record<string, StatsOutcomeByMap>;
  summary: StatsSummary;
};

export type StatsOutcomeByDuration = {
  minute: number;
  wins: number;
  losses: number;
  ties: number;
};

export type StatsOutcomeByOpponent = {
  player_name: string;
  profile_id: string;
  race: Race;
  wins: number;
  losses: number;
  ties: number;
};

export type StatsOutcomeByOpponentRace = {
  wins: number;
  losses: number;
  ties: number;
};

export type StatsOutcomeByMap = {
  wins: number;
  losses: number;
  ties: number;
};

export type StatsSummary = {
  points: number;
  wins: number;
  losses: number;
  ties: number;
  league: League;
  tier: number;
  mmr: number;
};
