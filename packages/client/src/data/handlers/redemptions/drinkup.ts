import { GenericSound } from "~/obs/redemptions";
import { asset } from "~/utils";
import { createRedemptionHandler, redemptionEnded } from "./base";

createRedemptionHandler({
  event: "drinkup",
  handler: () => {
    redemptionEnded("drinkup");
    GenericSound("drinkup", asset`sounds/wouder.mp3`);
  },
});
