export type TimestampString = string;

export interface FollowPayload {
  userId: string;
  userName: string;
  followedAt: TimestampString;
}

export type SubscribePayload = {
  userId: string;
  userName: string;
  tier: 1 | 2 | 3 | "prime";
  gifted: boolean;
};

export interface SubscriptionMessagePayload {
  userId: string;
  userName: string;
  tier: 1 | 2 | 3 | "prime";
  streak: number | null;
  cumulative: number;
  duration: number;
  message: string;
}

export type GiftSubscribePayload = {
  userId: string;
  userName: string;
  tier: 1 | 2 | 3 | "prime";
  total: number;
  anonymous: boolean;
  cumulative: number | null;
};

export interface SubscriptionEndPayload {
  userId: string;
  userName: string;
}

export type CheerPayload =
  | {
      message: string;
      bits: number;
    } & (
      | {
          anonymous: true;
          userId: null;
          userName: null;
        }
      | {
          anonymous: false;
          userId: string;
          userName: string;
        }
    );

export interface RaidPayload {
  fromId: string;
  fromName: string;
  viewers: number;
}

export interface HypeTrainBeginPayload {
  total: number;
  progress: number;
  goal: number;
}

export interface HypeTrainProgressPayload {
  level: number;
  total: number;
  progress: number;
  goal: number;
  top_contributions: {
    user_login: string;
    user_id: string;
    user_name: string;
    type: "bits" | "subscription";
    total: number;
  }[];
  last_contribution: {
    user_login: string;
    user_id: string;
    user_name: string;
    type: "bits" | "subscription";
    total: number;
  };
}

export interface HypeTrainEndPayload {
  level: number;
  total: number;
  cooldownEndsAt: TimestampString;
  top_contributions: {
    user_login: string;
    user_id: string;
    user_name: string;
    type: "bits" | "subscription";
    total: number;
  }[];
}

export interface StreamOnlinePayload {
  startedAt: TimestampString;
}

export interface StreamOfflinePayload {}

export interface PollBeginPayload {
  id: string;
  title: string;
  choices: { id: string; title: string }[];
  bitsVoting: {
    enabled: boolean;
    amountPerVote: number;
  };
  channelPointsVoting: {
    enabled: boolean;
    amountPerVote: number;
  };
  startedAt: TimestampString;
  endsAt: TimestampString;
}

export interface PollProgressPayload {
  id: string;
  title: string;
  choices: {
    id: string;
    title: string;
    bitsVotes: number;
    channelPointsVotes: number;
    votes: number;
  }[];

  bitsVoting: {
    enabled: boolean;
    amountPerVote: number;
  };
  channelPointsVoting: {
    enabled: boolean;
    amountPerVote: number;
  };
  startedAt: TimestampString;
  endsAt: TimestampString;
}

export interface PollEndPayload {
  id: string;
  title: string;
  choices: {
    id: string;
    title: string;
    bitsVotes: number;
    channelPointsVotes: number;
    votes: number;
  }[];
  bitsVoting: {
    enabled: boolean;
    amountPerVote: number;
  };
  channelPointsVoting: {
    enabled: boolean;
    amountPerVote: number;
  };
  status: "completed";
  startedAt: TimestampString;
  endsAt: TimestampString;
}

export interface PredictionBeginPayload {
  id: string;
  title: string;
  outcomes: { id: string; title: string; color: string }[];
  startedAt: TimestampString;
  locksAt: TimestampString;
}

export interface PredictionProgressPayload {
  id: string;
  title: string;
  outcomes: {
    id: string;
    title: string;
    color: string;
    users: number;
    channelPoints: number;
    topPredictors: {
      userName: string;
      userId: string;
      channelPointsUsed: number;
      channelPointsWon: null;
    }[];
  }[];
  startedAt: TimestampString;
  locksAt: TimestampString;
}

export interface PredictionLockPayload {
  id: string;
  title: string;
  outcomes: {
    id: string;
    title: string;
    color: string;
    users: number;
    channelPoints: number;
    topPredictors: {
      userName: string;
      userId: string;
      channelPointsUsed: number;
    }[];
  }[];
  startedAt: TimestampString;
  locksAt: TimestampString;
}

export interface PredictionEndPayload {
  id: string;
  title: string;
  winningOutcomeId: string;
  outcomes: {
    id: string;
    title: string;
    color: string;
    users: number;
    channelPoints: number;
    topPredictors: {
      userName: string;
      userId: string;
      channelPointsUsed: number;
      channelPointsWon: number | null;
    }[];
  }[];
  status: "resolved" | "canceled";
  startedAt: TimestampString;
  locksAt: TimestampString;
  endedAt: TimestampString;
}

export interface RedemptionAddPayload {
  id: string;
  userId: string;
  userName: string;
  input: string;
  status: "unfulfilled";
  reward: {
    id: string;
    title: string;
    cost: number;
  };
  fake?: boolean;
  redeemedAt: TimestampString;
}

export interface RedemptionUpdatePayload {
  id: string;
  userId: string;
  userName: string;
  input: string;
  status: "fulfilled" | "canceled";
  reward: {
    id: string;
    title: string;
    cost: number;
    prompt: string;
  };
  redeemedAt: TimestampString;
}

export interface ChannelUpdatePayload {
  title: string;
  category: string;
}

export interface EventSubTypeMap {
  "channel.follow": FollowPayload;
  "channel.subscribe": SubscribePayload;
  "channel.subscription.gift": GiftSubscribePayload;
  "channel.subscription.message": SubscriptionMessagePayload;
  "channel.subscription.end": SubscriptionEndPayload;
  "channel.cheer": CheerPayload;
  "channel.raid": RaidPayload;
  "channel.hype_train.begin": HypeTrainBeginPayload;
  "channel.hype_train.progress": HypeTrainProgressPayload;
  "channel.hype_train.end": HypeTrainEndPayload;
  "stream.online": StreamOnlinePayload;
  "stream.offline": StreamOfflinePayload;
  "channel.poll.begin": PollBeginPayload;
  "channel.poll.progress": PollProgressPayload;
  "channel.poll.end": PollEndPayload;
  "channel.prediction.begin": PredictionBeginPayload;
  "channel.prediction.progress": PredictionProgressPayload;
  "channel.prediction.lock": PredictionLockPayload;
  "channel.prediction.end": PredictionEndPayload;
  "channel.channel_points_custom_reward_redemption.add": RedemptionAddPayload;
  "channel.channel_points_custom_reward_redemption.update": RedemptionUpdatePayload;
  "channel.update": ChannelUpdatePayload;
}
