import { createRedemptionHandler, redemptionEnded } from "./base";
import { mainScene } from "~/obs/Main";
import { asset, wait } from "~/utils";
import { GenericVideo } from "~/obs/redemptions";

createRedemptionHandler({
  event: "explosion",
  handler: async (data) => {
    GenericVideo(
      "MSExplosion",
      mainScene,
      asset`Mine/Explode.mp4`,
      false,
      Math.random() * 1920,
      540,
      1.4,
      true
    );
    redemptionEnded("explosion");
  },
});
