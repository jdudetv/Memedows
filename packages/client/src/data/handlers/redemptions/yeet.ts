import { GenericSound, yeet } from "~/obs/redemptions";
import { asset } from "~/utils";
import { createRedemptionHandler, redemptionEnded } from "./base";

createRedemptionHandler({
  event: "yeet",
  handler: () => {
    GenericSound("yeet", asset`sounds/yeet.mp3`);
    yeet();
    redemptionEnded("yeet");
  },
});
