import { createRedemptionHandler, redemptionEnded } from "./base";
import { keyTap, keyToggle, moveMouseSmooth } from "robotjs";

createRedemptionHandler({
  event: "dropitem",
  handler: async (data) => {
    keyToggle("q", "down");
    setTimeout(() => {
      keyToggle("q", "up");
    }, 500);
    redemptionEnded("dropitem");
  },
});
