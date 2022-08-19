import {
  cancelSubscription,
  createSubscription,
  getActiveSubscriptions,
} from "../services/eventSubApi";
import { observable, runInAction } from "mobx";
import { BaseStore } from "./base";

enum EventSubTypes {
  redemptionAdd = "channel.channel_points_custom_reward_redemption.add",
  redemptionUpdate = "channel.channel_points_custom_reward_redemption.update",
  cheer = "channel.cheer",
  follow = "channel.follow",
  hypeTrainBegin = "channel.hype_train.begin",
  hypeTrainEnd = "channel.hype_train.end",
  hypeTrainProgress = "channel.hype_train.progress",
  pollBegin = "channel.poll.begin",
  pollProgress = "channel.poll.progress",
  pollEnd = "channel.poll.end",
  predictionBegin = "channel.prediction.begin",
  predictionProgress = "channel.prediction.progress",
  predictionEnd = "channel.prediction.end",
  predictionLock = "channel.prediction.lock",
  raid = "channel.raid",
  subscribe = "channel.subscribe",
  giftSubscribe = "channel.subscription.gift",
  subscriptionMessage = "channel.subscription.message",
  subscriptionEnd = "channel.subscription.end",
  channelUpdate = "channel.update",
  streamOffline = "stream.offline",
  streamOnline = "stream.online",
}

const EventSubNames = (() =>
  Object.entries(EventSubTypes).reduce(
    (acc, [name, topic]) => ({ ...acc, [topic]: name }),
    {} as any
  ))();

const eventNameFromType = (name: EventSubTypes) => EventSubNames[name];

const baseSubscriptionsState = () =>
  new Map<string, string | null>(
    Object.keys(EventSubTypes).map((name) => [name, null])
  );

class EventSubStore extends BaseStore {
  @observable
  subscriptions = baseSubscriptionsState();

  async loadSubscriptions() {
    const { data } = await getActiveSubscriptions();

    runInAction(() => {
      this.subscriptions = baseSubscriptionsState();

      data.forEach((s) => {
        const name = eventNameFromType(s.type as EventSubTypes);

        this.subscriptions!.set(name, s.id);
      });
    });

    return this.subscriptions;
  }

  async toggleStatus(type: keyof typeof EventSubTypes) {
    const id = this.subscriptions.get(type) as string | null;

    if (id === null) await createSubscription(EventSubTypes[type]);
    else await cancelSubscription(id);

    await this.loadSubscriptions();
  }
}

export const eventSubStore = new EventSubStore().initialize();
