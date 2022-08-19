import { createRedemptionHandler, redemptionEnded } from "./base";
import { mainScene } from "~/obs/Main";
import { asset, wait } from "~/utils";
import { GenericVideo } from "~/obs/redemptions/Video";

createRedemptionHandler({
  event: "general",
  handler: async (data) => {
    GenericVideo("MSExplosion", mainScene, asset`videos/GOOSE.mov`);
    await wait(15000);
    redemptionEnded("general");
  },
});
