import { createRedemptionHandler, redemptionEnded } from "./base";
import { greenScreenCameraScene, mainScene } from "~/obs/Main";
import { Alignment } from "@sceneify/core";
import { v4 as uuidv4 } from "uuid";
import { asset, wait } from "~/utils";
import { GenericSound } from "~/obs/redemptions";

createRedemptionHandler({
  event: "dab",
  handler: async (data) => {
    console.log("dab");
    GenericSound("DABSong", asset`sounds/dab.mp3`, 20);
    let GSC = await mainScene.createItem("GreenScreenCam", {
      source: greenScreenCameraScene,
      rotation: 90,
      alignment: Alignment.Center,
      positionX: 960,
      positionY: 630,
      scaleX: 1.78,
      scaleY: 1.78,
    });
    console.log(greenScreenCameraScene.item("camera").source.filters);
    await wait(17000);
    console.log("turning filters on");
    await greenScreenCameraScene
      .item("camera")
      .source.filter("SHAKE2")
      .setEnabled(true);
    await greenScreenCameraScene
      .item("camera")
      .source.filter("SDF")
      .setEnabled(true);
    await greenScreenCameraScene
      .item("camera")
      .source.filter("SHAKE1")
      .setEnabled(true);

    await mainScene.filter("DABBLOOM").setEnabled(true);

    await mainScene.filter("DABShakeX").setEnabled(true);

    await mainScene.filter("DABShakeY").setEnabled(true);

    await wait(12000);
    await GSC.remove();
    await greenScreenCameraScene
      .item("camera")
      .source.filter("SHAKE2")
      .setEnabled(false);
    await greenScreenCameraScene
      .item("camera")
      .source.filter("SDF")
      .setEnabled(false);
    await greenScreenCameraScene
      .item("camera")
      .source.filter("SHAKE1")
      .setEnabled(false);
    await mainScene.filter("DABBLOOM").setEnabled(false);

    await mainScene.filter("DABShakeX").setEnabled(false);

    await mainScene.filter("DABShakeY").setEnabled(false);
    redemptionEnded("dab");
  },
});
