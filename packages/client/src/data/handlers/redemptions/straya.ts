import { createRedemptionHandler, redemptionEnded } from "./base";
import { mainScene } from "~/obs/Main";

createRedemptionHandler({
  event: "straya",
  handler: async (data) => {
    mainScene.filter("STRAYATRANSFORM")!.setEnabled(true);
    setTimeout(() => {
      mainScene.filter("STRAYATRANSFORM")!.setEnabled(false);
      redemptionEnded("straya");
    }, 30000);
  },
});
