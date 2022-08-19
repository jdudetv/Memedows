import { createRedemptionHandler, redemptionEnded } from "./base";
import { cameraScene, mainScene, MainWrapper, obs } from "~/obs/Main";
import { GenericSound, GenericVideo } from "~/obs/redemptions";
import { MediaSource } from "@sceneify/sources";
import {
  ChromaKeyColorType,
  ChromaKeyFilter,
  CompressorFilter,
} from "@sceneify/filters";
import { asset } from "~/utils";
import { animate, Easing, keyframe } from "@sceneify/animation";
import { MonitoringType } from "@sceneify/core";

createRedemptionHandler({
  event: "rage",
  handler: async (data) => {
    const RAGE = await mainScene.createItem("RAGE", {
      source: new MediaSource({
        name: "RAGE",
        settings: {
          local_file: asset`videos/Rage.mp4`,
        },
        filters: {
          limiter: new CompressorFilter({
            name: "RAGEAUDIO",
            settings: {
              ratio: 20,
              threshold: -30,
              output_gain: 5,
            },
          }),
          chrokmaKey: new ChromaKeyFilter({
            name: "RAGE",
            settings: {
              key_color_type: ChromaKeyColorType.Custom,
              key_color: 0xffff00ff,
            },
          }),
        },
      }),
    });

    RAGE.source.setAudioMonitorType(MonitoringType.MonitorAndOutput);

    setTimeout(async () => {
      await RAGE.remove();
      await MainWrapper.item("Main").setTransform({
        positionX: 960,
        positionY: 540,
        scaleX: 1,
        scaleY: 1,
      });
      redemptionEnded("rage");
    }, 5000);
  },
});
