import { createRedemptionHandler, redemptionEnded } from "./base";
import { mainScene, obs } from "~/obs/Main";
import { ChromaKeyFilter, ColorKeyFilter } from "@sceneify/filters";
import { MediaSource } from "@sceneify/sources";
import { asset, wait } from "~/utils";
import { GenericSound } from "~/obs/redemptions";
import { MuteMic, UnmuteMic } from "~/obs/MuteMic";
import { MonitoringType } from "@sceneify/core";

createRedemptionHandler({
  event: "tobecontinued",
  handler: async (data) => {
    GenericSound("TBCSOUND", asset`sounds/tbc.mp3`);
    await wait(3400);
    let TBCVID = await mainScene.createItem("TBCVID", {
      source: new MediaSource({
        name: "TBCVID",
        settings: {
          local_file: asset`Big files for ignore/TBC.avi`,
        },
      }),
    });
    TBCVID.source.setAudioMonitorType(MonitoringType.MonitorAndOutput);

    await wait(500);
    mainScene.filter("TBCFreeze")?.setEnabled(true);
    MuteMic(obs);
    await wait(6000);
    mainScene.filter("TBCFreeze")?.setEnabled(false);
    UnmuteMic(obs);
    TBCVID.remove();
    redemptionEnded("tobecontinued");
  },
});
