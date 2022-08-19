import {
  FollowPayload,
  SubscribePayload,
  SubscriptionEndPayload,
  CheerPayload,
  RaidPayload,
  HypeTrainBeginPayload,
  HypeTrainProgressPayload,
  HypeTrainEndPayload,
  StreamOnlinePayload,
  StreamOfflinePayload,
  PollBeginPayload,
  PollProgressPayload,
  PollEndPayload,
  PredictionBeginPayload,
  PredictionProgressPayload,
  PredictionLockPayload,
  PredictionEndPayload,
  RedemptionAddPayload,
  RedemptionUpdatePayload,
  ChannelUpdatePayload,
  GiftSubscribePayload,
  SubscriptionMessagePayload,
} from "./twitch/events";

export * from "./twitch";
export interface PublicStats {
  pushups: {
    total: number;
    completed: number;
  };
  squats: {
    total: number;
    completed: number;
  };
}
export enum UserSubStatus {
  NotSubbed = 0,
  Tier1 = 1,
  Tier2 = 2,
  Tier3 = 3,
}

export interface NewUserData {
  id: string;
  displayName: string;
  createdAt: Date;
  subscription: UserSubStatus;
  following: boolean;
}

export interface UserData {
  displayName: string;
  id: string;
  hasFollowed?: true;
  xp: number;
  timeouts: number;
  votes: number;
  jailVisits: number;
  subscription: UserSubStatus;
}

export interface EventPayloadMap {
  follow: FollowPayload;
  subscribe: SubscribePayload;
  giftSubscribe: GiftSubscribePayload;
  subscriptionEnd: SubscriptionEndPayload;
  subscriptionMessage: SubscriptionMessagePayload;
  cheer: CheerPayload;
  raid: RaidPayload;
  hypeTrainBegin: HypeTrainBeginPayload;
  hypeTrainProgress: HypeTrainProgressPayload;
  hypeTrainEnd: HypeTrainEndPayload;
  streamOnline: StreamOnlinePayload;
  streamOffline: StreamOfflinePayload;
  pollBegin: PollBeginPayload;
  pollProgress: PollProgressPayload;
  pollEnd: PollEndPayload;
  predictionBegin: PredictionBeginPayload;
  predictionProgress: PredictionProgressPayload;
  predictionLock: PredictionLockPayload;
  predictionEnd: PredictionEndPayload;
  redemptionAdd: RedemptionAddPayload;
  redemptionUpdate: RedemptionUpdatePayload;
  userAccountCreated: UserData;
  channelUpdate: ChannelUpdatePayload;
}
