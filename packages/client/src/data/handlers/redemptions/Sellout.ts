import { createRedemptionHandler, redemptionEnded } from "./base";
import { mainScene } from "~/obs/Main";
import { MonitoringType } from "@sceneify/core";
import { MediaSource } from "@sceneify/sources";
import {
  ChromaKeyFilter,
  ColorKeyFilter,
  ChromaKeyColorType,
} from "@sceneify/filters";
import { v4 as uuidv4 } from "uuid";
import { asset, wait } from "~/utils";

createRedemptionHandler({
  event: "sellout",
  handler: async (data) => {
    redemptionEnded("sellout");
    let uuid = "sellout" + uuidv4();
    let currentSellout = await mainScene.createItem(uuid, {
      source: new MediaSource({
        name: uuid,
        settings: {
          local_file: asset`videos/Sellout.mp4`,
        },
      }),
    });

    currentSellout.source.addFilter(
      "Chroma",
      new ChromaKeyFilter({
        name: "ColourMeBitches",
        settings: {},
      })
    );

    await currentSellout.source.setAudioMonitorType(
      MonitoringType.MonitorAndOutput
    );

    await wait(8000);
    currentSellout.remove();
  },
});
