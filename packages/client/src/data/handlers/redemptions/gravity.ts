import { createRedemptionHandler, redemptionEnded } from "./base";
import { FilthyFrank } from "~/obs/redemptions/FF";
import { world } from "~/obs/physics";

createRedemptionHandler({
  event: "gravity",
  handler: async (data) => {
    if (data.input.toLowerCase() === "zero g") world.gravity = [0, 98];
    if (data.input.toLowerCase() === "left") world.gravity = [-980, 980];
    if (data.input.toLowerCase() === "right") world.gravity = [980, 980];
    if (data.input.toLowerCase() === "slam") world.gravity = [0, 5000];
    setTimeout(() => {
      world.gravity = [0, 980];
      redemptionEnded("gravity");
    }, 10000);
  },
});
