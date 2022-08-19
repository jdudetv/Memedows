import { createRedemptionHandler, redemptionEnded } from "./base";
import { keyTap, keyToggle, moveMouseSmooth } from "robotjs";

createRedemptionHandler({
  event: "jump",
  handler: async (data) => {
    console.log("jumping");
    keyToggle("space", "down");
    setTimeout(() => {
      keyToggle("space", "up");
    }, 200);
    redemptionEnded("jump");
  },
});
