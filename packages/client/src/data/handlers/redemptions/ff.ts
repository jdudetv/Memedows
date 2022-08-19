import { createRedemptionHandler, redemptionEnded } from "./base";
import { FilthyFrank } from "~/obs/redemptions/FF";

createRedemptionHandler({
  event: "ff",
  handler: async (data) => {
    redemptionEnded("ff");
    FilthyFrank();
  },
});
