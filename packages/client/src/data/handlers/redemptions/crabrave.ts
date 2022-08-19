import { createRedemptionHandler, redemptionEnded } from "./base";
import { mainScene, obs } from "~/obs/Main";
import { Alignment, MonitoringType, Scene } from "@sceneify/core";
import {
  ChromaKeyColorType,
  ChromaKeyFilter,
  ColorKeyFilter,
} from "@sceneify/filters";
import { GDIPlusTextSource, MediaSource } from "@sceneify/sources";
import { v4 as uuidv4 } from "uuid";
import { asset, wait } from "~/utils";
import { DynamicMask, PixelateShader } from "~/obs/filters";
import { animate } from "@sceneify/animation";
import { registerPhysicsItem, unregisterPhysicsItem } from "~/obs/physics";
import { ClientRequest } from "electron";
import { createVideoWindow, GenericSound } from "~/obs/redemptions";

createRedemptionHandler({
  event: "crabrave",
  handler: async (data) => {
    GenericSound("CRABRAVEAUDIO", asset`sounds/crabrave.mp3`, -10, true, 0);
    setTimeout(async () => {
      for (let i = 0; i < 20; i++) {
        await createVideoWindow(mainScene, "CRABRAVENEW");
      }
    }, 1000);

    let CrabRaveText = new GDIPlusTextSource({
      name: "Crabravetext",
      settings: {
        text: data.input,
        font: {
          face: "Comic Sans MS",
          size: 150,
        },
        outline: true,
        extents: true,
        extents_cx: 1920,
        extents_cy: 8000,
        outline_size: 10,
        outline_color: 0xff000000,
        align: "center",
        valign: "top",
      } as any,
    });

    setTimeout(async () => {
      await mainScene.createItem("CrabRave", {
        source: CrabRaveText,
        positionX: 960,
        positionY: 450,
        alignment: Alignment.TopCenter,
        enabled: false,
      });
    }, 12000);

    setTimeout(() => {
      mainScene.item("CrabRave").setEnabled(true);
    }, 14800);

    setTimeout(async () => {
      await CrabRaveText.remove();
    }, 31000);

    setTimeout(() => {
      redemptionEnded("crabrave");
    }, 35000);
  },
});
