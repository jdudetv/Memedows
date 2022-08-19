import { createRedemptionHandler, redemptionEnded } from "./base";
import { createSound } from "~/obs/redemptions";
import { doc, FieldValue, increment, updateDoc } from "firebase/firestore";
import { db } from "~/data/services/firebase";
import { soundsStore } from "~/data/stores";
import { refundRedemption } from "~/data/services/twitchApi";

createRedemptionHandler({
  event: "sounds",
  handler: async (data) => {
    redemptionEnded("sounds");
    createSound(data.input);
    let name = data.input.toUpperCase() + ".redemptions";
    if (!soundsStore.sounds.includes(data.input.toUpperCase())) {
      refundRedemption(data.id, data.reward.id);
      return;
    }
    updateDoc(doc(db, "public", "sounds"), {
      [name]: increment(1),
    });
  },
});
