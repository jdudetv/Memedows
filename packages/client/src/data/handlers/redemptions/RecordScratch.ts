import { transaction } from "mobx";
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
  event: "recordscratch",
  handler: async (data) => {
    GenericSound("RecordScratchSound", asset`sounds/freeze.mp3`, -30, false);
    mainScene.filter("RecordScratchFilter").setEnabled(true);
    MuteMic(obs);
    animate({
      subjects: {
        mainWRAP: MainWrapper.item("Main"),
      },
      keyframes: {
        mainWRAP: {
          positionX: {
            11000: keyframe(
              (1920 -
                mainScene.item("cameraWindow").transform.positionX -
                960) *
                3 +
                960,
              Easing.Linear
            ),
          },
          positionY: {
            11000: keyframe(
              (1080 -
                mainScene.item("cameraWindow").transform.positionY -
                540) *
                3 +
                540,
              Easing.Linear
            ),
          },
          scaleX: {
            11000: keyframe(3, Easing.Linear),
          },
          scaleY: {
            11000: keyframe(3, Easing.Linear),
          },
        },
      },
    });
    await wait(11250);
    await mainScene.filter("RecordScratchFilter").setEnabled(false);
    await MainWrapper.item("Main").setTransform({
      positionX: 960,
      positionY: 540,
      scaleX: 1,
      scaleY: 1,
    });
    UnmuteMic(obs);
    redemptionEnded("recordscratch");
  },
});
