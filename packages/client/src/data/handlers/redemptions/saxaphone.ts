import { transaction } from "mobx";
import { ColorCorrectionFilter, ImageMaskBlendFilter } from "@sceneify/filters";
import { ImageSource } from "@sceneify/sources";
import { animate, Easing, keyframe } from "@sceneify/animation";
import { FreezeFrame, ThreeDTransform } from "~/obs/filters";
import {
  greenScreenCameraScene,
  mainScene,
  MainWrapper,
  obs,
} from "~/obs/Main";
import { MuteMic, UnmuteMic } from "~/obs/MuteMic";
import { GenericSound } from "~/obs/redemptions";
import { asset, wait } from "~/utils";
import { createRedemptionHandler, redemptionEnded } from "./base";

createRedemptionHandler({
  event: "saxaphone",
  handler: async (data) => {
    GenericSound("SaxaphoneSound", asset`sounds/saxaphone.mp3`, -20, true);
    await mainScene.filter("SaxaphoneTransform").setEnabled(true);
    await mainScene.filter("CCorrection").setEnabled(true);
    await mainScene.filter("SaxaphoneFreeze").setEnabled(true);

    MuteMic(obs);
    animate({
      subjects: {
        FOVFilter: MainWrapper.item("Main").source.filter("SaxaphoneTransform"),
      },
      keyframes: {
        FOVFilter: {
          "Scale.X": {
            11000: keyframe(0, Easing.In),
          },
          "Scale.Y": {
            11000: keyframe(0, Easing.In),
          },
          "Rotation.X": {
            11000: keyframe(Math.random() * 180, Easing.In),
          },
          "Rotation.Y": {
            11000: keyframe(Math.random() * 180, Easing.In),
          },
          "Rotation.Z": {
            11000: keyframe(Math.random() * 180, Easing.In),
          },
        },
      },
    });
    await wait(11500);
    console.log("running");
    await mainScene.filter("SaxaphoneFreeze").setEnabled(false);
    await mainScene.filter("CCorrection").setEnabled(false);
    await mainScene.filter("SaxaphoneTransform").setSettings({
      "Scale.X": 100,
      "Scale.Y": 100,
      "Rotation.X": 0,
      "Rotation.Y": 0,
      "Rotation.Z": 0,
    });
    await mainScene.filter("SaxaphoneTransform").setEnabled(false);
    UnmuteMic(obs);
    redemptionEnded("saxaphone");
  },
});
