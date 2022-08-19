import { observable } from "mobx";
import { EventPayloadMap } from "@memedows/types";
import { EventEmitter2 } from "eventemitter2";

import { eventsStore } from "../../stores/events";
import { redemptionsStore } from "~/data/stores";
import Redemptions from "~/routes/redemptions";
import { wait } from "~/utils";

interface CreateHandlerArgs<S extends Record<string, any>> {
  state?: S;
  event: string;
  handler: (
    data: EventPayloadMap["redemptionAdd"],
    state: S
  ) => void | Promise<void>;
}

export const redemptionEmitter = new EventEmitter2();

eventsStore.on("redemptionAdd", async (p) => {
  console.log(p);
  let Name = p.reward.title;
  const queue = redemptionsStore.redemptionQueue.get(
    p.reward.title.toLowerCase()
  );
  if (queue?.length === 0) {
    await redemptionsStore.AddToQueue(p);
    redemptionEmitter.emitAsync(p.reward.title.toLowerCase(), p);
  } else {
    p.reward.title = Name.toLowerCase();
    redemptionsStore.AddToQueue(p);
  }
  if (p.fake === true) return;
  redemptionsStore.Adduse(Name);
  redemptionsStore.redemptionCount(Name);
});

export const createRedemptionHandler = <S extends Record<string, any>>(
  args: CreateHandlerArgs<S>
) => {
  const state = observable(args.state ?? {});
  redemptionEmitter.on(
    args.event.toLowerCase(),
    (e: EventPayloadMap["redemptionAdd"]) => args.handler(e, state as any)
  );
  return state;
};

export async function redemptionEnded(name: string) {
  await wait(100);

  redemptionsStore.RemoveFromQueue(name.toLowerCase());
  const queue = redemptionsStore.redemptionQueue.get(name);
  if (queue?.length === 0) return;
  // @ts-ignore
  const latest = redemptionsStore.redemptionQueue.get(name)[0];
  redemptionEmitter.emitAsync(name.toLowerCase(), latest);
}

export async function resumeRedemptionQueue() {
  await wait(100);
  for (let [redemption, data] of redemptionsStore.redemptionQueue) {
    if (data.length != 0) {
      console.log("data exists");
      console.log(data[0].reward!.title);
      redemptionEmitter.emitAsync(data[0].reward!.title.toLowerCase(), data[0]);
    }
  }
}
