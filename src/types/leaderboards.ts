import { LeaderboardType, League, Race } from "@/lib/stormgateworld/types";
import { Int, Num } from "@cloudflare/itty-router-openapi";

export const LeaderboardResponse = {
  page: Int,
  count: Int,
  total: Int,
  entries: [
    {
      leaderboard_entry_id: String,
      leaderboard: LeaderboardType,
      player_id: String,
      anonymous: Boolean,
      nickname: String,
      nickname_discriminator: String,
      avatar_url: String,
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
};
