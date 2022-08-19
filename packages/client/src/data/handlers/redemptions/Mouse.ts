import { createRedemptionHandler, redemptionEnded } from "./base";
import { moveMouseSmooth } from "robotjs";

createRedemptionHandler({
  event: "mouse",
  handler: async (data) => {
    const randX = 1280 + Math.floor(Math.random() * 100) - 150;
    const randY = 720 + Math.floor(Math.random() * 100) - 50;
    moveMouseSmooth(randX, randY);
    redemptionEnded("mouse");
  },
});
