import { createRedemptionHandler, redemptionEnded } from "./base";
import { FilthyFrank } from "~/obs/redemptions/FF";
import { GenericVideo } from "~/obs/redemptions";
import { mainScene } from "~/obs/Main";
import { asset } from "~/utils";
import { v4 } from "uuid";

createRedemptionHandler({
  event: "flashbang",
  handler: async (data) => {
    console.log("test");
    GenericVideo(
      "FlashBang" + v4(),
      mainScene,
      asset`videos/flashbang.mp4`,
      false,
      960,
      540,
      1,
      true
    );
    redemptionEnded("flashbang");
  },
});
