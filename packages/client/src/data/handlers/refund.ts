import { Alignment } from "@sceneify/core";
import { GDIPlusTextSource, ImageSource, MediaSource } from "@sceneify/sources";
import { mainScene, MainWrapper } from "~/obs/Main";
import { eventList, StartMenu, toggleStartMenu } from "~/obs/startMenu";
import { asset, wait } from "~/utils";
import { localDB } from "../jsondb";
import { TMIClient } from "../services/emotes";
import { Kofi, KofiDonation } from "../services/Kofi";
import { checkSubbed, refundRedemption } from "../services/twitchApi";
import { eventsStore, redemptionsStore, usersStore } from "../stores";
import { createHandler } from "./base";

let store = "store/refund/variables";

let DATA = localDB.getData(store);

export function freeTier(name: string) {
  DATA.FreeTier = name;
  StartMenu.item("FreeTier").source.setSettings({
    text: `Free Redemption\n${DATA.FreeTier}`,
  });
  localDB.push(store, DATA);
}

const TiersList: Record<string, number> = {
  "Tier 1": 1,
  "Tier 2": 2,
  "Tier 3": 3,
  "Tier 4": 4,
  "Tier 5": 5,
  "Tier 6": 6,
  "Tier 420": 7,
  "Tier Ayy lmao": 8,
};

createHandler({
  event: "cheer",
  handler: async (data) => {
    AddTime(data.bits);
    eventStartMenu();
    let refundData = localDB.getData(store);
    refundData.cheerAmount += data.bits;
    if (
      refundData.cheerAmount >=
      refundData.cheerThreshold * refundData.cheerMultiplier
    ) {
      refundData.cheerAmount -=
        refundData.cheerThreshold * refundData.cheerMultiplier;
      refundData.cheerMultiplier++;
      StartMenu.item("BitsGoal").source.setSettings({
        text:
          "BITS " +
          parseInt(refundData.cheerAmount) +
          " / " +
          parseInt(refundData.cheerThreshold) *
            parseInt(refundData.cheerMultiplier),
      });
      refundEvent("Bits");
    }
    StartMenu.item("BitsGoal").source.setSettings({
      text:
        "BITS " +
        parseInt(refundData.cheerAmount) +
        " / " +
        parseInt(refundData.cheerThreshold) *
          parseInt(refundData.cheerMultiplier),
    });
    localDB.push(store, refundData);
  },
});

createHandler({
  event: "subscribe",
  handler: async (data) => {
    if (data.gifted === true) {
      console.log(data.tier);
      if (data.tier === 1) addSubscription(1);
      if (data.tier === 2) addSubscription(2);
      if (data.tier === 3) addSubscription(5);
      if (data.tier === "prime") addSubscription(1);
    }
  },
});

createHandler({
  event: "subscriptionMessage",
  handler: async (data) => {
    console.log(data.tier);

    if (data.tier === 1) {
      addSubscription(1);
      AddTime(250);
    }
    if (data.tier === 2) {
      addSubscription(2);
      AddTime(500);
    }
    if (data.tier === 3) {
      addSubscription(5);
      AddTime(1250);
    }
    if (data.tier === "prime") {
      addSubscription(1);
      AddTime(250);
    }
  },
});

const subTiers: Record<string, number> = {
  "1000": 1,
  prime: 1,
  "2000": 2,
  "3000": 3,
};

eventsStore.on("redemptionAdd", async (p) => {
  if (p.fake === true) return;
  let refundData = localDB.getData(store);
  let SubData = await checkSubbed(p.userId);
  let isSubbed = 0;
  let RefundTier = undefined;
  let KofiSub = 0;
  if (SubData.data.length === 1) {
    isSubbed = subTiers[SubData.data[0].tier];
  }
  let redemp;
  let RedempDescript;
  if (parseInt(refundData.RefundEvent) === 1) {
    console.log("6");
    refundRedemption(p.id, p.reward.id);
  }
  for (let data of redemptionsStore.redemptions) {
    if (data[0].toLowerCase() === p.reward.title.toLowerCase()) {
      redemp = redemptionsStore.redemptions.get(data[0]);
    }
  }
  if (redemp?.prompt) {
    RedempDescript = redemp?.prompt;
  } else {
    RedempDescript = "";
  }

  for (let data in TiersList) {
    if (RedempDescript.includes(data)) {
      RefundTier = TiersList[data];
    }
  }
  try {
    KofiSub = localDB.getData(`/store/Tiers/${p.userName.toLowerCase()}/tier`);
  } catch (error) {}

  if (KofiSub > isSubbed) isSubbed = KofiSub;
  console.log(isSubbed);
  console.log(RefundTier);
  if (isSubbed === undefined || RefundTier === undefined) return;
  if (
    isSubbed >= RefundTier ||
    p.reward.title.toLowerCase() === refundData.FreeTier
  ) {
    refundRedemption(p.id, p.reward.id);
  }
});

export function DonationRefundHandling(data: KofiDonation) {
  AddTime(parseInt(data.amount) * 100);
  eventStartMenu();
  let refundData = localDB.getData(store);
  refundData.donationAmount =
    parseFloat(refundData.donationAmount) + parseFloat(data.amount) * 100;
  if (
    parseFloat(refundData.donationAmount) >=
    parseInt(refundData.donationThreshold) *
      parseInt(refundData.donationMultiplier)
  ) {
    refundData.donationAmount =
      parseFloat(refundData.donationAmount) -
      parseInt(refundData.donationThreshold) *
        parseInt(refundData.donationMultiplier);
    refundData.donationMultiplier = parseInt(refundData.donationMultiplier) + 1;
    StartMenu.item("DonoGoal").source.setSettings({
      text:
        "DONO $" +
        parseFloat(refundData.donationAmount) / 100 +
        " / $" +
        (parseInt(refundData.donationThreshold) *
          parseInt(refundData.donationMultiplier)) /
          100,
    });
    refundEvent("Donation");
  }
  StartMenu.item("DonoGoal").source.setSettings({
    text:
      "DONO $" +
      parseFloat(refundData.donationAmount) / 100 +
      " / $" +
      (parseInt(refundData.donationThreshold) *
        parseInt(refundData.donationMultiplier)) /
        100,
  });
  localDB.push(store, refundData);
}

let refund = localDB.getData(store);

async function addSubscription(subNumber: number) {
  eventStartMenu();
  refund = localDB.getData(store);
  if (parseInt(refund.subBuffer) === 0) {
    refund.subBuffer = parseInt(refund.subBuffer) + subNumber;
    localDB.push(store, refund);
    SubCounter();
  } else {
    refund.subBuffer = parseInt(refund.subBuffer) + subNumber;
  }
}

async function SubCounter() {
  let refundData = localDB.getData(store);
  if (parseInt(refundData.subBuffer) === 0) return;
  refundData.subscriptionAmount = parseInt(refundData.subscriptionAmount) + 1;
  refundData.subBuffer = parseInt(refundData.subBuffer) - 1;
  if (
    parseInt(refundData.subscriptionAmount) ===
    parseInt(refundData.subscriptionThreshold) *
      parseInt(refundData.subscriptionMultiplier)
  ) {
    refundData.subscriptionAmount = 0;
    refundData.subscriptionMultiplier =
      parseInt(refundData.subscriptionMultiplier) + 1;
    StartMenu.item("SubGoal").source.setSettings({
      text:
        "SUBS " +
        parseInt(refundData.subscriptionAmount) +
        " / " +
        parseInt(refundData.subscriptionThreshold) *
          parseInt(refundData.subscriptionMultiplier),
    });
    refundEvent("Sub");
  }
  StartMenu.item("SubGoal").source.setSettings({
    text:
      "SUBS " +
      parseInt(refundData.subscriptionAmount) +
      " / " +
      parseInt(refundData.subscriptionThreshold) *
        parseInt(refundData.subscriptionMultiplier),
  });
  localDB.push(store, refundData);
  await wait(500);
  SubCounter();
}

let CloseStartMenu = 0;
let RefundCountdown = localDB.getData(store);

async function eventStartMenu() {
  if (!mainScene.item("StartMenu")?.enabled) {
    toggleStartMenu();
  } else {
    CloseStartMenu = 15;
  }
}

setInterval(async () => {
  let refundData = localDB.getData(store);
  if (refundData.FreeTierTimer > 0) {
    refundData.FreeTierTimer--;
    localDB.push(store, refundData);
  } else {
    if (!redemptionsStore.redemptions.get("FreeTierVote")?.enabled)
      redemptionsStore.toggleRedemption("FreeTierVote", false);
  }
  if (parseInt(refundData.RefundEvent) === 0) {
  } else {
    console.log("this code is dumb");
    if (refundData.RefundCountdown !== 0) {
      refundData.RefundCountdown = parseInt(refund.RefundCountdown) - 1;
      localDB.push(store, refundData);
      (
        MainWrapper.item("CounterText")!.source as GDIPlusTextSource
      ).setSettings({
        text: `Refund: ${refundData.RefundCountdown}`,
      });
    }
    if (refundData.RefundCountdown === 30)
      TMIClient.say("jdudetv", "30 SECONDS LEFT UNTIL REFUNDS STOP.");
    if (refundData.RefundCountdown === 20)
      TMIClient.say("jdudetv", "20 SECONDS LEFT UNTIL REFUNDS STOP.");
    if (refundData.RefundCountdown === 10)
      TMIClient.say("jdudetv", "10 SECONDS LEFT UNTIL REFUNDS STOP.");
    if (refundData.RefundCountdown < 5)
      TMIClient.say("jdudetv", refundData.RefundCountdown + " Seconds left");
    if (refundData.RefundCountdown === 0 && refundData.RefundEvent === 1) {
      refundData.RefundEvent = 0;
      await MainWrapper.item("CounterText")!.remove();
      await MainWrapper.item("Counter")!.remove();
    }
  }
  if (CloseStartMenu === 0) {
  } else {
    CloseStartMenu--;
    if (CloseStartMenu === 0) {
      if (mainScene.item("StartMenu")!.enabled) toggleStartMenu();
    }
  }
}, 1000);

export async function AddTime(amount: number) {
  let refundData = localDB.getData(store);
  if (refundData.RefundEvent === 1) {
    let seconds = (amount / 100) * 2;
    let refundData = localDB.getData(store);
    (refundData.RefundCountdown = parseInt(refund.RefundCountdown) + seconds),
      localDB.push(store, refundData);
  }
}

async function refundEvent(trigger: string) {
  TMIClient.say(
    "jdudetv",
    "/me CHAT HAS HIT THE " +
      trigger +
      " Goal. All redemptions will be refunded for the next 69 Seconds. HYPERPogFish HYPERPogFish HYPERPogFish HYPERPogFish HYPERPogFish HYPERPogFish HYPERPogFish "
  );
  let refundData = localDB.getData(store);
  let redemptionsToToggle = ["", "H. Court", "", "Chaos", "thanos snap"];
  if (redemptionsToToggle[refundData.RefundsHit] !== "")
    redemptionsStore.toggleRedemption(
      redemptionsToToggle[refundData.RefundsHit],
      true
    );

  await MainWrapper.createItem("Counter", {
    source: new ImageSource({
      name: "Counter",
      settings: {
        file: asset`refund/Box.png`,
      },
    }),
    positionX: -35,
    positionY: -118,
    alignment: Alignment.Center,
  });

  await MainWrapper.createItem("CounterText", {
    source: new GDIPlusTextSource({
      name: "CounterText",
      settings: {
        text: `Refund: ${refundData.RefundCountdown}`,
        outline: true,
        outline_color: 0xff000000,
        outline_size: 5,
        font: {
          size: 50,
        },
      } as any,
    }),
  });
  refundData.RefundsHit = parseInt(refund.RefundsHit) + 1;
  refundData.RefundCountdown = parseInt(refund.RefundCountdown) + 69;
  refundData.RefundEvent = 1;
  localDB.push(store, refundData);
}

// await axios.patch("https://api.twitch.tv/helix/channel_points/custom_rewards/redemptions", {}, {
//     params: { status: 'CANCELED', id: refundID, broadcaster_id : 25118940 , reward_id : rewardID },
//     headers: {'client-id': twitchConfig.clientId, Authorization: 'Bearer ' + twitchConfig.accessToken }
// })
