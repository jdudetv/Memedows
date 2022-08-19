import { createRedemptionHandler, redemptionEnded } from "./base";
import { createVideoWindow } from "~/obs/redemptions";
import { mainScene } from "~/obs/Main";
import { videosStore } from "~/data/stores/videos";
import { wait } from "~/utils";

createRedemptionHandler({
  event: "chaos",
  handler: async (data) => {
    await chaos();
  },
});

export async function chaos() {
  let keys = Array.from(videosStore.videos.keys());
  for (let i = 0; i < 30; i++) {
    let vid = Math.floor(Math.random() * keys.length);
    await createVideoWindow(mainScene, keys[vid]);
  }
  await wait(10000);
  redemptionEnded("chaos");
}
