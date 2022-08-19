import { createRedemptionHandler, redemptionEnded } from "./base";
import { mainScene, obs } from "~/obs/Main";
import { wait } from "~/utils";
import { PixelateShader } from "~/obs/filters";

createRedemptionHandler({
  event: "pixelate",
  handler: async (data) => {
    await mainScene.filter("pixelate")?.setEnabled(true);
    mainScene.filter("cartoon")?.setEnabled(true);
    mainScene.filter("CRTPixel")?.setEnabled(true);
    // await await obs.call("SetSourceFilterEnabled", {
    //   sourceName: "Mic/Aux",
    //   filterName: "pixelate",
    //   filterEnabled: true,
    // });
    await wait(15000);
    await mainScene.filter("pixelate")?.setEnabled(false);
    mainScene.filter("cartoon")?.setEnabled(false);
    mainScene.filter("CRTPixel")?.setEnabled(false);
    // obs.call("SetSourceFilterEnabled", {
    //   sourceName: "Mic/Aux",
    //   filterName: "pixelate",
    //   filterEnabled: false,
    // });
    redemptionEnded("pixelate");
  },
});
