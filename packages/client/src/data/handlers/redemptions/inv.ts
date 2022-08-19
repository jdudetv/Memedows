import { createRedemptionHandler, redemptionEnded } from "./base";
import { keyTap, keyToggle, moveMouseSmooth } from "robotjs";

createRedemptionHandler({
  event: "openinventory",
  handler: async (data) => {
    keyToggle("e", "down");
    setTimeout(() => {
      keyToggle("e", "up");
    }, 500);
    redemptionEnded("openinventory");
  },
});
