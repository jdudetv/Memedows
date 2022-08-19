import { doc } from "firebase/firestore";
import { UserSubStatus } from "@memedows/types";
import axios from "axios";
import { increment, updateDoc } from "firebase/firestore";
import { mainScene } from "~/obs/Main";
import { GenericSound, GenericVideo, TTSFunction } from "~/obs/redemptions";
import { asset, getRandomInt, updateUsersXP } from "~/utils";
import { amountAlerts, EventFeed } from ".";
import { localDB } from "../jsondb";
import { TMIClient } from "../services/emotes";
import { db } from "../services/firebase";
import { DISCOUNT, FakeEvent, redemptionsStore } from "../stores";
import { usersStore } from "../stores/users";
import { createHandler } from "./base";

export const bits = createHandler({
  event: "cheer",
  handler: async (data) => {
    EventFeed("Bits", data.anonymous ? "Anonymouse" : data.userName, data);
    if (!data.anonymous) await usersStore.grantXp(data.userId, data.bits);
    if (data.bits >= 10000) {
      GenericSound("AYAY 10 MINS", asset`sounds/ayaya10.mp3`, -10, true, 0);
    }
    if (data.bits > 49) TTSFunction(data.message);
    if (data.bits > 200)
      FakeEvent(
        "bitsplinko",
        data.anonymous ? "Anonymouse" : data.userName,
        data.bits.toString()
      );
    let Spins = 0;
    if (data.bits < 101) SecretBit(data.bits);
    await amountAlerts(
      data.bits,
      data.message,
      data.anonymous ? "Anonymous" : data.userName,
      "Bits"
    );
    FakeEvent("shoot", "", data.bits.toString());
  },
});

export async function SecretBit(amount: number) {
  let SB = parseInt(localDB.getData("/store/secretBitAmount"));
  let bits = localDB.getData("store/secretBit");
  if (amount === SB) {
    localDB.push("/store/secretBitAmount", getRandomInt(0, 100));
    TMIClient.say(
      "jdudetv",
      "THE SECRET BIT HAS BEEN FOUND IT WAS " +
        SB +
        " Everything is discounted by 5% for the rest of stream. And a new number has been picked. good luck."
    );
    for (let thing of bits) {
      thing.state = false;
    }
    GiveBonusXP();
    redemptionsStore.PermDiscount(-0.05);
    redemptionsStore.redemptions.forEach((data) => {
      redemptionsStore.updateRedemption(data);
    });
    localDB.push("store/secretBit", bits);
    await updateDoc(doc(db, "public", "SecretBit"), {
      bits,
    });
    return;
  }
  if (bits[amount - 1] === undefined) {
    console.log(amount);
    console.log(bits);
    bits[amount - 1].state = true;
    localDB.push("store/secretBit", bits);
    await updateDoc(doc(db, "public", "SecretBit"), {
      bits,
    });
  } else if (bits[amount - 1].state === false) {
    bits[amount - 1].state = true;
    localDB.push("store/secretBit", bits);
    await updateDoc(doc(db, "public", "SecretBit"), {
      bits,
    });
  }
}

const xpBase = 500;

const subXpMultiplier: Record<UserSubStatus, number> = {
  0: 1,
  1: 2,
  2: 4,
  3: 10,
};

async function GiveBonusXP() {
  const res = await axios.get(
    "https://tmi.twitch.tv/group/user/jdudetv/chatters"
  );
  const { vips, moderators, staff, admins, global_mods, viewers } =
    res.data.chatters;

  const allViewers = new Set<string>([
    ...vips,
    ...moderators,
    ...staff,
    ...admins,
    ...global_mods,
    ...viewers,
    "jdudetv",
  ]);

  let xpUpdates: Record<string, number> = {};

  for (let viewer of allViewers) {
    let viewerData = usersStore.accounts.get(viewer);

    if (viewerData === undefined) continue;
    let Chatters = localDB.getData("/store/chatters/");
    let position = Chatters.indexOf(viewerData.displayName.toLowerCase());
    let multiplier = 1;
    if (position !== -1) {
      multiplier = 1 - position / 10 + 1;
    }
    let xpEarned = xpBase;
    xpEarned *= subXpMultiplier[viewerData.subscription] * multiplier;

    xpUpdates[viewerData.id] = xpEarned;
  }

  try {
    await updateUsersXP(xpUpdates);
  } catch {}
}
