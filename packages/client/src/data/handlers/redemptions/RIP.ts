import { createRedemptionHandler, redemptionEnded } from "./base";
import { mainScene } from "~/obs/Main";
import { ChromaKeyFilter } from "@sceneify/filters";
import { MediaSource } from "@sceneify/sources";

import { asset, wait } from "~/utils";
import { MonitoringType } from "@sceneify/core";

createRedemptionHandler({
  event: "rip",
  handler: async (data) => {
    let RIP = await mainScene.createItem("RIP", {
      source: new MediaSource({
        name: "RIP",
        settings: {
          local_file: asset`videos/MURDER.mp4`,
        },
      }),
    });

    RIP.source.addFilter(
      "Chroma",
      new ChromaKeyFilter({
        name: "ColourMeBitches",
        settings: {},
      })
    );

    await RIP.source.setAudioMonitorType(MonitoringType.MonitorAndOutput);

    await wait(4000);
    RIP.remove();
    redemptionEnded("rip");
  },
});
