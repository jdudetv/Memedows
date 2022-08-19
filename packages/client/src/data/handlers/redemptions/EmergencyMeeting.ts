import { createRedemptionHandler, redemptionEnded } from "./base";
import { mainScene } from "~/obs/Main";
import { MediaSource } from "@sceneify/sources";
import {
  ChromaKeyColorType,
  ChromaKeyFilter,
  ColorKeyFilter,
} from "@sceneify/filters";
import { v4 as uuidv4 } from "uuid";
import { asset, wait } from "~/utils";
import { MonitoringType } from "@sceneify/core";

createRedemptionHandler({
  event: "emergencymeeting",
  handler: async (data) => {
    let Emergencymeeting = await mainScene.createItem("EmergencyMeeting", {
      source: new MediaSource({
        name: "EmergencyMeeting",
        settings: {
          local_file: asset`videos/EMERGENCYMEETING.mp4`,
        },
      }),
    });

    Emergencymeeting.source.addFilter(
      "Chroma",
      new ChromaKeyFilter({
        name: "ColourMeBitches",
        settings: {},
      })
    );

    await Emergencymeeting.source.setAudioMonitorType(
      MonitoringType.MonitorAndOutput
    );

    await wait(4000);
    Emergencymeeting.remove();
    redemptionEnded("emergencymeeting");
  },
});
