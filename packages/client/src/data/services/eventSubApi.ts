import axios from "axios";

import authScopes from "~/constants/authScopes";

const authed =
  <Args extends any[], RT>(fn: (...args: Args) => Promise<RT>) =>
  async (...args: Args): Promise<RT> => {
    try {
      return await fn(...args);
    } catch {
      await refreshToken();
      return await fn(...args);
    }
  };

const helixAPI = axios.create({
  baseURL: "https://api.twitch.tv/helix/eventsub",
  headers: {
    "Client-ID": import.meta.env.VITE_TWITCH_CLIENT_ID,
  },
});

const oauthAPI = axios.create({
  baseURL: "https://id.twitch.tv/oauth2/",
});

async function refreshToken() {
  const client_id = import.meta.env.VITE_TWITCH_CLIENT_ID;
  const client_secret = import.meta.env.VITE_TWITCH_CLIENT_SECRET;
  const res = await oauthAPI.post("token", null, {
    params: {
      client_id,
      client_secret,
      scopes: authScopes.join(","),
      grant_type: "client_credentials",
    },
  });

  localStorage.setItem("AppAuth", res.data.acces_token);
  helixAPI.defaults.headers.Authorization = `Bearer ${res.data.access_token}`;
}

export const initializeEventSubAPI = async () => {
  await refreshToken();
};

export const getActiveSubscriptions = authed(
  async (): Promise<{
    data: {
      id: string;
      type: string;
    }[];
  }> => {
    const { data } = await helixAPI.get("/subscriptions");
    return data;
  }
);

export const createSubscription = authed(async (type: string) => {
  if (type === "channel.raid") {
    await helixAPI.post("/subscriptions", {
      type,
      version: "1",
      condition: {
        to_broadcaster_user_id: "25118940",
      },
      transport: {
        method: "webhook",
        callback: import.meta.env.VITE_WEBHOOK_API_ENDPOINT,
        secret: "secretoooooooooo",
      },
    });
  } else {
    await helixAPI.post("/subscriptions", {
      type,
      version: "1",
      condition: {
        broadcaster_user_id: "25118940",
      },
      transport: {
        method: "webhook",
        callback: import.meta.env.VITE_WEBHOOK_API_ENDPOINT,
        secret: "secretoooooooooo",
      },
    });
  }
});

export const cancelSubscription = authed(async (id: string) => {
  await helixAPI.delete(`/subscriptions?id=${id}`);
});
