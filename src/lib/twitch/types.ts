type TwitchStream = {
  id: number;
  user_id: string;
  user_login: string;
  user_name: string;
  game_id: string;
  game_name: string;
  type: string;
  title: string;
  viewer_count: number;
  started_at: string;
  language: string;
  thumbnail_url: string;
  tag_ids: string[];
  is_mature: boolean;
};

type TwitchStreamsResponse = {
  data: TwitchStream[];
  pagination: {
    cursor: string;
  };
};

type TwitchUsersResponse = {
  data: TwitchUser[];
  pagination: {
    cursor: string;
  };
};

type TwitchUser = {
  id: string;
  login: string;
  display_name: string;
  type: string;
  broadcaster_type: string;
  description: string;
  profile_image_url: string;
  offline_image_url: string;
  view_count: number;
  created_at: string;
};

type TwitchAccessTokenResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  scope: string;
  token_type: "bearer";
};

type TwitchAccessToken = {
  access_token: string;
  expires_at: number;
};
