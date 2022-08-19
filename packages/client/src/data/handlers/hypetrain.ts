import { keyTap } from "robotjs";
import {
  hypeTrainBegin,
  hypeTrainEnd,
  hypeTrainProgress,
  hypeTrainTrain,
} from "~/obs/hypeTrain";
import Redemptions from "~/routes/redemptions";
import { wait } from "~/utils";
import { localDB } from "../jsondb";
import {
  HYPETRAINDISCOUNT,
  redemptionsStore,
  RedemptionsStore,
  usersStore,
} from "../stores";
import { createHandler } from "./base";
import { EventFeed } from "./eventFeed";

createHandler({
  event: "hypeTrainBegin",
  handler: async (data) => {
    EventFeed("HypeTrainStart", "jdude", data);
    keyTap("audio_stop");
    console.log("hype train started");
    console.log(data);
    HypeTrain(1);
    hypeTrainBegin();
  },
});

createHandler({
  event: "hypeTrainProgress",
  handler: async (data) => {
    let hypetrainusers = await localDB.getData("/store/hypetrainusers");
    if (hypetrainusers.indexOf(data.last_contribution.user_name) === -1) {
      localDB.push(
        "/store/hypetrainusers",
        [data.last_contribution.user_name],
        false
      );
    }
    console.log("hype train progress update");
    HypeTrain(data.level);
    console.log(data);
    hypeTrainProgress(data.level, data.progress, data.goal);
  },
});

createHandler({
  event: "hypeTrainEnd",
  handler: async (data) => {
    EventFeed("HypeTrainEnd", "jdude", data);
    keyTap("audio_stop");
    console.log("hype train ended");
    console.log(data);
    await HypeTrain(6);
    await hypeTrainEnd();
    localDB.push("/store/hypetrainusers", []);
  },
});

export async function HypeTrain(Level: number) {
  let Discount = 0;
  switch (Level) {
    case 1:
      Discount = 0.9;
      break;
    case 2:
      Discount = 0.75;
      break;
    case 3:
      Discount = 0.6;
      break;
    case 4:
      Discount = 0.45;
      break;
    case 5:
      Discount = 0.3;
      break;
    case 6:
      Discount = 1;
      await redemptionsStore.toggleRedemption("explosion", false);
      await redemptionsStore.toggleRedemption("thanos snap", false);
      await redemptionsStore.HypeTrainDiscount(1);
      redemptionsStore.redemptions.forEach((data) => {
        redemptionsStore.updateRedemption(data);
      });
      return;
  }
  if (Discount == HYPETRAINDISCOUNT) return;
  await redemptionsStore.HypeTrainDiscount(Discount);
  redemptionsStore.redemptions.forEach((data) => {
    redemptionsStore.updateRedemption(data);
  });
}
