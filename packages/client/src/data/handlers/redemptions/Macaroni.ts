import { createRedemptionHandler, redemptionEnded } from "./base";
import { mainScene } from "~/obs/Main";
import { asset, wait } from "~/utils";
import { PixelateShader } from "~/obs/filters";
import { GenericSound } from "~/obs/redemptions";
import { animate, Easing, keyframe, keyframes } from "@sceneify/animation";

createRedemptionHandler({
  event: "macaroni",
  handler: async (data) => {
    GenericSound("Macaroni", asset`sounds/macaroni.mp3`);
    await wait(5300);
    animate({
      subjects: {
        camera: mainScene.item("cameraWindow").source.filter("Zoom"),
        cameraFilter: mainScene
          .item("cameraWindow")
          .source.filter("CCorrection"),
      },
      keyframes: {
        camera: {
          "Camera.FieldOfView": {
            1500: keyframe(60, Easing.Out),
          },
        },
        cameraFilter: {
          opacity: {
            1500: 0,
          },
        },
      },
    });
    await wait(2500);
    mainScene.item("cameraWindow").source.filter("CCorrection").setSettings({
      opacity: 1,
    });
    mainScene.item("cameraWindow").source.filter("Zoom").setSettings({
      "Camera.FieldOfView": 90,
    });

    redemptionEnded("macaroni");
  },
});
