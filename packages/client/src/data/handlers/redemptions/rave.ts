import { createRedemptionHandler, redemptionEnded } from "./base";
import { createVideoWindow, GenericSound } from "~/obs/redemptions";
import { mainScene } from "~/obs/Main";
import { videosStore } from "~/data/stores/videos";
import { asset, wait } from "~/utils";
import { getBody } from "~/obs/physics";
import { WindowItem } from "~/obs/Window";

createRedemptionHandler({
  event: "rave",
  handler: async (data) => {
    await RAVE();
  },
});

export async function RAVE() {
  GenericSound("DUBSTEP", asset`sounds/BASS.mp3`);
  if (getBody(mainScene.item("cameraWindow")) === undefined) {
    (mainScene.item("cameraWindow") as WindowItem<any>).registerPhysics();
  }
  await wait(3680);
  const body = getBody(mainScene.item("cameraWindow"))!;
  const angle = Math.random() * Math.PI;
  for (let i = 0; i <= 31; i++) {
    body.velocity = [Math.random() * 1000 - 500, Math.random() * 1000 - 500];
    body.angularVelocity = (Math.random() - 0.5) * 30;
    await wait(455);
  }
  redemptionEnded("rave");
}
