import { EventPayloadMap } from "@memedows/types";
import axios from "axios";
import { observable } from "mobx";
import { persist } from "~/decorators";
import { localDB } from "../jsondb";
import {
  createRedemption,
  deleteRedemption,
  updateRedemption,
  ProvisionalRedemption,
  Redemption,
} from "../services/twitchApi";
import { BaseStore } from "./base";

let RAIDMULTIPLIER = 1;
export let HYPETRAINDISCOUNT = 1;
export let DISCOUNT = 1;
const MODIFIER = 5;
let BIGDISC = 1;

export class RedemptionsStore extends BaseStore {
  @observable @persist redemptions = new Map<string, Redemption>();
  @observable @persist redemptionQueue = new Map<
    string,
    Partial<EventPayloadMap["redemptionAdd"]>[]
  >();
  @observable @persist redemptionTotal = -1;

  async createRedemption(data: ProvisionalRedemption) {
    const rawData = await createRedemption(data);
    rawData.defaultcost = rawData.cost;
    rawData.timer = 0;
    rawData.count = 0;
    rawData.toggle = 1;
    this.redemptions.set(data.title, rawData);
  }

  async updateActiveRedemptions(Num: number) {
    if ((this.redemptionTotal = -1)) {
      this.redemptionTotal = 0;
      for (let [index, redemptions] of this.redemptions) {
        if (redemptions.is_enabled === true) {
          this.redemptionTotal++;
        }
      }
    }
    this.redemptionTotal + Num;
  }

  async setGroup(name: string, state: boolean) {
    const groups = localDB.getData("store/groups");
    if (groups[name].deleteRedemption === false && state === false) return;
    if (groups[name].deleteRedemption === true && state === true) return;
    localDB.push(`store/groups/${name}/deleteRedemptions`, state);
    console.log("updating store");
    await redemptionsStore.toggleRedemptions(groups[name].items, !state);
  }

  async toggleRedemptions(
    titles: string[],
    disabled: boolean,
    deletes: boolean = true
  ) {
    console.log("toggle redemptions");
    for (let title of titles) {
      const redemption = this.redemptions.get(title);
      if (!redemption) return;
      console.log(disabled);
      console.log(deletes);
      try {
        if (deletes) {
          console.log("deletes");
          if (disabled) {
            console.log("disabled");
            console.log(redemption.toggle);
            if (redemption.toggle === 1) {
              //deletes the redemption from twitch
              await deleteRedemption(redemption.id!);
              redemptionsStore.updateActiveRedemptions(-1);
              redemption.id = "";
              (redemption as any).enabled = false;
              redemption.toggle = 0;
              console.log("1");
            } else {
              if (redemption.toggle !== 0) {
                redemption.toggle--;
                console.log("not 0");
              }
            }
          } else {
            console.log("Else");
            if (redemption.toggle === 0) {
              //adds redemption to twitch
              const { id } = await createRedemption(redemption);
              redemptionsStore.updateActiveRedemptions(-1);
              redemption.enabled = true;
              console.log("0");
              redemption.id = id;
              redemption.toggle = 1;
            } else {
              console.log("not 0");
              redemption.toggle++;
            }
          }
        } else {
          console.log("else 2");
          if (redemption.enabled) {
            console.log("enabled");
            //pauses redemption
            redemption.is_enabled = !disabled;
            await updateRedemption(redemption);
          }
        }
      } catch {
        return;
      }
    }
  }

  async deleteRedemption(title: string) {
    const redemption = this.redemptions.get(title);
    if (!redemption) return;

    this.redemptions.delete(title);

    if (redemption.id) await deleteRedemption(redemption.id).catch(() => {});
  }

  async toggleRedemption(title: string, enabled?: boolean) {
    const redemption = this.redemptions.get(title);
    if (!redemption) return;
    try {
      if (redemption.enabled) {
        if (enabled === false || enabled === undefined) {
          await deleteRedemption(redemption.id!);
          redemption.id = "";
          (redemption as any).enabled = false;
          redemption.toggle = 0;
        }
      } else {
        if (enabled === true || enabled === undefined) {
          const { id } = await createRedemption(redemption);
          redemption.enabled = true;
          redemption.id = id;
          redemption.toggle = 1;
        }
      }
    } catch {
      return;
    }
  }

  async redemptionCount(title: string) {
    const redemption = this.redemptions.get(title);
    if (!redemption) return;
    if (redemption.count) {
      redemption.count++;
    } else {
      redemption.count = 1;
    }
    redemption.timer = Math.round(
      redemption.count * (redemption.defaultcost / 100) * 4
    );
    redemptionsStore.updateRedemption(redemption);
  }

  async RAIDDISCOUNT() {
    RAIDMULTIPLIER -= 0.05;
  }

  async HypeTrainDiscount(number: number) {
    HYPETRAINDISCOUNT = number;
  }

  async Discount(number: number) {
    if (DISCOUNT > number) {
      DISCOUNT = number;
    }
    if (number === 1) DISCOUNT = 1;
  }

  async PermDiscount(number: number) {
    BIGDISC += number;
  }

  async Specificdiscount(number: number, title: string) {
    let redemption = this.redemptions.get(title);
    if (redemption) {
      redemption.iDiscount = number;
      return true;
    }
  }

  async updateRedemption(data: ProvisionalRedemption) {
    let redemption = this.redemptions.get(data.title);
    if (redemption?.iDiscount === undefined) {
      redemption!.iDiscount = 1;
    }
    if (!redemption) return;
    if (data.count || data.timer) {
      redemption.count = data.count;
      redemption.timer = data.timer;
    }
    (data as any).enabled = redemption.enabled;
    (redemption.cost as any) = Math.max(
      1,
      Math.round(
        redemption.iDiscount *
          BIGDISC *
          DISCOUNT *
          HYPETRAINDISCOUNT *
          RAIDMULTIPLIER *
          Math.round(
            Math.max(
              redemption.defaultcost +
                Math.pow(MODIFIER, redemption.count - 2.5),
              redemption.defaultcost
            )
          )
      )
    );
    if (redemption.enabled) {
      await updateRedemption(data, redemption.id!);
    }
    (data as any).id = redemption.id;
    this.redemptions.set(data.title, data as any);
  }

  async Adduse(title: string) {
    let redemption = this.redemptions.get(title);
    if (redemption === undefined) return;
    if (redemption?.uses !== undefined) {
      redemption.uses++;
    } else {
      redemption.uses = 1;
    }
  }

  async AddToQueue(data: Partial<EventPayloadMap["redemptionAdd"]>) {
    let currentQueue = this.redemptionQueue.get(data.reward!.title);
    if (currentQueue === undefined)
      currentQueue = [] as Partial<EventPayloadMap["redemptionAdd"]>[];
    //@ts-ignore
    data.reward.title = data.reward?.title.toLowerCase();
    currentQueue.push(data);
    this.redemptionQueue.set(data.reward!.title, currentQueue as any);
  }

  async RemoveFromQueue(name: string) {
    const currentQueue = this.redemptionQueue.get(name);
    currentQueue!.splice(0, 1);
    this.redemptionQueue.set(name, currentQueue as any);
  }
}

export const redemptionsStore = new RedemptionsStore().initialize();

let Nice = 0;

const helixAPI = axios.create({
  baseURL: "https://api.twitch.tv/helix/streams?user_id=25118940&first=1",
  headers: {
    "Client-ID": import.meta.env.VITE_TWITCH_CLIENT_ID,
  },
});

// setInterval(async () => {
//   const { data } = await helixAPI.get({
//     headers: {
//       Authorization: "Bearer " + import.meta.env.VITE_TWITCH_ACCESS_TOKEN,
//       Accept: "application/vnd.twitchtv.v5+json",
//       "Client-ID": import.meta.env.VITE_TWITCH_CLIENT_ID,
//     },
//   });
//   if (data.data[0].viewer_count == 69) {
//     if (Nice == 0) {
//       GenericSound("NICE", asset`sounds/NoiceCeption.mp3`);
//       Nice = 1;
//     }
//   }
//   VIEWERMULTIPLIER = Math.max(
//     0.005 * Math.pow(data.data[0].viewer_count, 1.05) + 0.6,
//     1
//   );
// }, 30000);

setInterval(() => {
  redemptionsStore.redemptions.forEach((data) => {
    if (data.count == 0) return;
    if (data.timer > 0) {
      data.timer--;
    } else {
      if (data.count > 0) data.count--;
      redemptionsStore.updateRedemption(data);
      data.timer = Math.round(data.count * 1.5);
    }
  });
}, 1000);
