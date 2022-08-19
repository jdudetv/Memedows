import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import io from "socket.io-client";
import { Donation, EventFeed } from "../handlers";
import { DonationRefundHandling } from "../handlers/refund";
import { FakeEvent, usersStore } from "../stores";
import { db } from "./firebase";
import { GenericSound, TTSFunction } from "~/obs/redemptions";
import { asset } from "~/utils";
import { createHandler } from "../handlers/base";
import { localDB } from "../jsondb";

// const SLSocketKey = import.meta.env.VITE_STREAMLABS_SOCKET_KEY;

// const streamlabsWS = io(`https://sockets.streamlabs.com?token=${SLSocketKey}`, {
//   transports: ["websocket"],
// });

// export interface StreamlabsDonation {
//   type: string;
//   event_id: string;
//   message: {
//     from: string;
//     isTest: boolean;
//     formatted_amount: string;
//     amount: string;
//     message: string;
//     currency: string;
//     historical: boolean;
//   }[];
//   for: "streamlabs";
// }

const KofiTiers: Record<string, number> = {
  "Tier 1 Sub": 1,
  "Tier 2 Sub": 2,
  "Tier 3 Sub": 3,
  "Tier 4 Sub": 4,
  "Tier 5 Sub": 5,
  "Tier 6 Sub": 6,
  "TIER 420 AYY LMAO": 7,
  "TIER AYY LMAO THICC DICC GAMER": 8,
};

export interface KofiDonation {
  amount: string;
  currency: string;
  email: string;
  from_name: string;
  is_first_subscription_payment: boolean;
  is_public: boolean;
  is_subscription_payment: boolean;
  message: string;
  tier_name: string | null;
  type: string;
}

export const Kofi = createHandler({
  event: "Kofi",
  handler: async (data: KofiDonation) => {
    EventFeed("Donation", data.from_name, data);
    console.log(data);
    if (data.type === "Donation") {
      Donation(data);
      let shots = Number(data.amount) * 100;
      FakeEvent("shoot", "", shots.toString());
      DonationRefundHandling(data);
      TTSFunction(data.message);
      const userDocs = await getDocs(
        query(
          collection(db, "users"),
          where("displayName", "==", data.from_name)
        )
      );

      if (userDocs.empty) return;

      await usersStore.grantXp(
        userDocs.docs[0].data().id,
        Math.floor(parseFloat(data.amount)) * 100
      );
    } else if (data.type === "Subscription") {
      if (data.tier_name === null) {
        return;
      }
      EventFeed("Ko-fi Subscription", data.from_name, data);
      localDB.push(
        `/store/Tiers/${data.from_name.toLowerCase()}/tier`,
        KofiTiers[data.tier_name]
      );
      localDB.push(
        `/store/Tiers/${data.from_name.toLowerCase()}/date`,
        Date.now()
      );

      console.log("subscription");
    }
  },
});

export async function initalizeStreamlabs() {}
