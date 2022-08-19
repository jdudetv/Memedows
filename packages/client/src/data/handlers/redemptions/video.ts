import { createRedemptionHandler, redemptionEnded } from "./base";
import { createVideoWindow } from "~/obs/redemptions";
import { mainScene } from "~/obs/Main";
import { doc, increment, updateDoc } from "firebase/firestore";
import { db } from "~/data/services/firebase";
import { videosStore } from "~/data/stores";
import { refundRedemption } from "~/data/services/twitchApi";

createRedemptionHandler({
  event: "videos",
  handler: async (data) => {
    const videoData = videosStore.videos.get(data.input.toUpperCase());
    redemptionEnded("videos");
    if (!videoData) {
      refundRedemption(data.id, data.reward.id);
      return;
    }
    if (data.input.toLocaleLowerCase() === "ogcum") return;
    if (data.input.toLocaleLowerCase() === "com zone") {
      if (Math.random() * 100 > 99) {
        createVideoWindow(mainScene, "OGCUM");
        let name = data.input.toUpperCase() + ".redemptions";
        updateDoc(doc(db, "public", "videos"), {
          [name]: increment(1),
        });
        return;
      }
    }

    createVideoWindow(mainScene, data.input);
    let name = data.input.toUpperCase() + ".redemptions";
    if (!videosStore.videos.has(data.input.toUpperCase())) return;
    updateDoc(doc(db, "public", "videos"), {
      [name]: increment(1),
    });
  },
});
