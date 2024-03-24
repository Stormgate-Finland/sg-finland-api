import { chunk } from "@/utils/helpers";
import { twitchConfig } from "./config";
import { Env } from "@/types/common";
import { StreamType } from "@/types/streams";

const ACCESS_TOKEN_KEY = "TWITCH_ACCESS_TOKEN";

export class Twitch {
  accessToken: string;
  apiHeaders: { [key: string]: string };
  KV: KVNamespace;
  config: {
    clientId: string;
    clientSecret: string;
  };

  constructor(env: Env) {
    this.config = {
      clientId: env.TWITCH_CLIENT_ID,
      clientSecret: env.TWITCH_CLIENT_SECRET,
    };
    this.KV = env.KV;
    this.apiHeaders = { "Client-ID": this.config.clientId };
    this.accessToken = "";

    if (!this.config.clientId) {
      console.error("Missing Twitch APP ID.");
    }
  }

  private setAccessToken = async () => {
    const body = {
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
      grant_type: "client_credentials",
    };
    const accessToken: TwitchAccessToken = JSON.parse(
      await this.KV.get(ACCESS_TOKEN_KEY)
    );
    const gracePeriod = 1000;
    if (accessToken && accessToken.expires_at > Date.now() - gracePeriod) {
      this.accessToken = accessToken.access_token;
      return;
    }
    const res = await fetch(
      new Request(twitchConfig.oAuthUrl, {
        method: "POST",
        body: JSON.stringify(body),
        headers: { "Content-Type": "application/json" },
      })
    );
    const data = (await res.json()) as TwitchAccessTokenResponse;
    if (!data.access_token) {
      throw new Error("Failed to get twitch access token");
    }
    this.accessToken = data.access_token;
    await this.KV.put(
      ACCESS_TOKEN_KEY,
      JSON.stringify({
        access_token: data.access_token,
        expires_at: Date.now() + data.expires_in * 1000,
      })
    );
  };

  getStreams = async (ids: string[] | number[]) => {
    await this.setAccessToken();
    const endPoint = "/streams";
    const limit = 100; // twitch supports 100 per request
    const chunks = chunk(ids, limit);
    let streams: TwitchStream[] = [];
    await Promise.all(
      chunks.map(async (logins) => {
        const params = `first=${limit}&user_login=${logins.join(
          `&user_login=`
        )}`;
        const req = new Request(`${twitchConfig.apiUrl}${endPoint}?${params}`, {
          headers: {
            ...this.apiHeaders,
            Authorization: "Bearer " + this.accessToken,
          },
        });
        const res = await fetch(req);
        const body = (await res.json()) as TwitchStreamsResponse;
        streams = streams.concat(body.data);
      })
    );
    return streams;
  };

  async getUsers(ids: string[]) {
    if (!ids) {
      return [];
    }
    await this.setAccessToken();
    const endPoint = "/users";
    const limit = 100; // twitch supports 100 per request
    const chunks = chunk(ids, 100);
    let users: TwitchUser[] = [];
    await Promise.all(
      chunks.map(async (logins) => {
        const params = `first=${limit}&login=${logins.join(`&login=`)}`;
        const req = new Request(`${twitchConfig.apiUrl}${endPoint}?${params}`, {
          headers: {
            ...this.apiHeaders,
            Authorization: "Bearer " + this.accessToken,
          },
        });
        const res = await fetch(req);
        console.log(res);
        const body = (await res.json()) as TwitchUsersResponse;
        users = users.concat(body.data);
      })
    );
    return users;
  }

  getStreamDetails = async (url: string) => {
    const userLogin = Twitch.getTwitchUserLogin(url);
    if (!userLogin) {
      return null;
    }
    const users = await this.getUsers([userLogin]);
    return users?.length > 0
      ? {
          providerId: users[0].login,
          provider: StreamType.Enum.twitch,
          url: Twitch.getChannelUrl(users[0].login),
          avatarUrl: users[0].profile_image_url,
        }
      : null;
  };

  static getTwitchThumbnail = (
    url?: string,
    height?: number,
    width?: number
  ) => {
    if (!url) {
      return "";
    }
    width = !width && height ? Math.round((height / 9) * 16) : width;
    height = !height && width ? Math.round((width / 16) * 9) : height;
    const w = width || 720;
    const h = height || 405;
    return url
      .replace("{width}", w.toString())
      .replace("{height}", h.toString())
      .concat(`?${new Date().getTime()}`);
  };

  static getTwitchUserLogin = (url: string) => {
    const match = url.match(/twitch\.tv\/([^/#?\s]+)/);
    return match ? match[1].toLowerCase() : null;
  };

  static getChannelUrl = (twitchUserLogin: string) =>
    `https://www.twitch.tv/${twitchUserLogin}`;
}
