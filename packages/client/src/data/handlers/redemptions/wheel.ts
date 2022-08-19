import { randomWheelItems } from "~/obs/redemptions/wheel";
import { createRedemptionHandler, redemptionEnded } from "./base";

createRedemptionHandler({
  event: "wheelofmemefortune",
  handler: (data) => {
    console.log("wheel emitting");
    console.log(data);
    randomWheelItems(data);
  },
});
