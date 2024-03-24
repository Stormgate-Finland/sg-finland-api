type StreamsTableRow = {
  id: number;
  provider_id: string;
  provider: StreamProvider;
  url: string;
  avatar_url: string | null;
};

type StreamProvider = "twitch" | "youtube";
