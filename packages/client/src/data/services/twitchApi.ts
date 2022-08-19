import axios from "axios";
import { doc, onSnapshot } from "firebase/firestore";

import { broadcaster_id } from "~/constants/twitch";
import { db } from "./firebase";

const helixAPI = axios.create({
  baseURL: "https://api.twitch.tv/helix/",
  headers: {
    "Client-ID": import.meta.env.VITE_TWITCH_CLIENT_ID,
  },
});

export const initializeTwitchAPI = async () => {
  onSnapshot(doc(db, "private", "twitchApiAuth"), (snap) => {
    const { accessToken } = snap.data()!;

    helixAPI.defaults.headers.Authorization = `Bearer ${accessToken}`;
  });
};

export interface ProvisionalRedemption {
  broadcaster_user_id?: string;
  broadcaster_user_login?: string;
  broadcaster_user_name?: string;
  is_enabled?: boolean;
  is_paused?: boolean;
  is_in_stock?: boolean;
  title: string;
  cost: number;
  defaultcost: number;
  timer: number;
  count: number;
  toggle: number;
  uses: number;
  iDiscount: number;
  prompt?: string;
  is_user_input_required?: boolean;
  should_redemptions_skip_request_queue?: boolean;
  background_color?: string;
  image?: any;
  default_image?: any;
  max_per_stream_setting?: {
    is_enabled: boolean;
    max_per_stream: number;
  };
  max_per_user_per_stream_setting?: {
    is_enabled: boolean;
    max_per_user_per_stream: number;
  };
  global_cooldown_setting?: {
    is_enabled: boolean;
    global_cooldown_seconds: number;
  };
  cooldown_expires_at?: string;
  redemptions_redeemed_current_stream?: number;
}

export type Redemption = Required<ProvisionalRedemption> &
  ({ id: string; enabled: boolean } | { id?: string; enabled: boolean });

export const getRewards = async () => {
  // const { data } = await helixAPI.get(
  //   `channel_points/custom_rewards?broadcaster_id=${broadcaster_id}`
  // );

  return {};

  // return data.data.reduce(
  //   (obj: any, el: RawReward) => ({ ...obj, [el.title]: el }),
  //   {}
  // );
};

interface choices {
  title: string;
}

export const CreatePoll = async (
  title: string,
  choices: Array<choices>,
  duration: number,
  channel_points_per_vote?: number,
  bits_per_vote?: number
) => {
  let bits_voting_enabled = false;
  let channel_points_voting_enabled = false;
  if (bits_per_vote) {
    bits_voting_enabled = true;
  }
  if (channel_points_per_vote) {
    channel_points_voting_enabled = true;
  }

  const { data } = await helixAPI.post(
    `polls`,
    {
      choices,
    },
    {
      params: {
        broadcaster_id,
        title,
        choices,
        duration,
        bits_voting_enabled,
        bits_per_vote,
        channel_points_per_vote,
        channel_points_voting_enabled,
      },
    }
  );

  return data.data[0].id;
};

export const GetProfilePic = async (id: string) => {
  const { data } = await helixAPI.get(`users?id=${id}`, {
    params: {
      broadcaster_id,
    },
  });
};

export const GetID = async (username: string) => {
  const { data, status } = await helixAPI.get(`users?login=${username}`, {
    params: {},
  });

  if (data.data[0] === undefined) {
    return undefined;
  } else {
    return data.data[0].id;
  }
};

export const checkSubbed = async (id: string) => {
  const { data, status } = await helixAPI.get(`subscriptions`, {
    params: {
      broadcaster_id,
      user_id: id,
    },
  });

  if (status != 200) {
    return false;
  }

  return data;
};

export const refundRedemption = async (
  id: string,
  reward_id: string
): Promise<Redemption> => {
  const { data } = await helixAPI.patch(
    `channel_points/custom_rewards/redemptions`,
    {},
    {
      params: {
        status: "CANCELED",
        id,
        reward_id,
        broadcaster_id,
      },
    }
  );

  return {
    ...fixRedemptionFromHelix(data.data[0]),
  } as Redemption;
};

export const createRedemption = async (
  redemptionData: ProvisionalRedemption
): Promise<Redemption> => {
  const { data } = await helixAPI.post(
    `channel_points/custom_rewards`,
    fixRedemptionForHelix(redemptionData),
    {
      params: {
        broadcaster_id,
      },
    }
  );

  return {
    ...fixRedemptionFromHelix(data.data[0]),
    enabled: true,
  } as Redemption;
};

export const deleteRedemption = (id: string) =>
  helixAPI.delete(`channel_points/custom_rewards`, {
    params: {
      broadcaster_id,
      id,
    },
  });

export const updateRedemption = async (
  redemptionData: ProvisionalRedemption,
  id?: string
): Promise<Redemption> => {
  const { data } = await helixAPI.patch(
    `channel_points/custom_rewards`,
    fixRedemptionForHelix(redemptionData),
    {
      params: {
        broadcaster_id,
        id,
      },
    }
  );

  return fixRedemptionFromHelix(data.data[0]);
};

const fixRedemptionForHelix = (redemptionData: ProvisionalRedemption) => ({
  ...redemptionData,

  is_max_per_stream_enabled: redemptionData.max_per_stream_setting?.is_enabled,
  max_per_stream: redemptionData.max_per_stream_setting?.max_per_stream,

  is_max_per_user_per_stream_enabled:
    redemptionData.max_per_user_per_stream_setting?.is_enabled,
  max_per_user_per_stream:
    redemptionData.max_per_user_per_stream_setting?.max_per_user_per_stream,

  is_global_cooldown_enabled:
    redemptionData.global_cooldown_setting?.is_enabled,
  global_cooldown_seconds:
    redemptionData.global_cooldown_setting?.global_cooldown_seconds,
});

const fixRedemptionFromHelix = (redemptionData: any): Redemption => ({
  ...redemptionData,

  max_per_stream_setting: {
    is_enabled: redemptionData.is_max_per_stream_enabled,
    max_per_stream: redemptionData.max_per_stream,
  },
  max_per_user_per_stream_setting: {
    is_enabled: redemptionData.is_max_per_user_per_stream_enabled,
    max_per_user_per_stream: redemptionData.max_per_user_per_stream,
  },
  global_cooldown_setting: {
    is_enabled: redemptionData.is_global_cooldown_enabled,
    global_cooldown_seconds: redemptionData.global_cooldown_seconds,
  },
});
