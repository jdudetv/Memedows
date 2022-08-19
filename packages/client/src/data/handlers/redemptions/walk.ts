import { createRedemptionHandler, redemptionEnded } from "./base";
import { keyTap, keyToggle, moveMouseSmooth } from "robotjs";

createRedemptionHandler({
  event: "walk",
  handler: async (data) => {
    let direction = "w";
    if (data.input.toLowerCase().includes("left")) {
      direction = "a";
    } else if (data.input.toLowerCase().includes("right")) {
      direction = "d";
    } else if (data.input.toLowerCase().includes("forward")) {
      direction = "w";
    } else if (data.input.toLowerCase().includes("back")) {
      direction = "s";
    }
    keyToggle(direction, "down");
    setTimeout(() => {
      keyToggle(direction, "up");
    }, 500);
    redemptionEnded("walk");
  },
});
