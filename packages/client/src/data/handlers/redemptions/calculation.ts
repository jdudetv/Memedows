import { createRedemptionHandler, redemptionEnded } from "./base";
import { cameraScene, mainScene, MainWrapper } from "~/obs/Main";
import { GenericSound, GenericVideo } from "~/obs/redemptions";
import { MediaSource } from "@sceneify/sources";
import { ChromaKeyFilter, CompressorFilter } from "@sceneify/filters";
import { asset, wait } from "~/utils";
import { animate, Easing, keyframe } from "@sceneify/animation";

createRedemptionHandler({
  event: "calculating",
  handler: async (data) => {
    GenericSound("Resonance", asset`sounds/resonance.mp3`);
    GenericSound("Resonance", asset`sounds/dialup.mp3`);
    const CALCULATE = await cameraScene.createItem("CALCULATE", {
      source: new MediaSource({
        name: "CALCULATE",
        settings: {
          local_file: asset`videos/math.webm`,
        },
        filters: {
          limiter: new CompressorFilter({
            name: "AudioLimiter",
            settings: {
              ratio: 20,
              threshold: -30,
              output_gain: 5,
            },
          }),
          chrokmaKey: new ChromaKeyFilter({
            name: "ChromaKeyFrank",
            settings: {},
          }),
        },
      }),
    });

    await animate({
      subjects: {
        mainWRAP: MainWrapper.item("Main"),
      },
      keyframes: {
        mainWRAP: {
          positionX: {
            11000: keyframe(
              (1920 -
                mainScene.item("cameraWindow")!.transform.positionX -
                960) *
                2 +
                960,
              Easing.Linear
            ),
          },
          positionY: {
            11000: keyframe(
              (1080 -
                mainScene.item("cameraWindow")!.transform.positionY -
                540) *
                2 +
                540,
              Easing.Linear
            ),
          },
          scaleX: {
            11000: keyframe(2, Easing.Linear),
          },
          scaleY: {
            11000: keyframe(2, Easing.Linear),
          },
        },
      },
    });
    await wait(500);
    CALCULATE.remove();
    MainWrapper.item("Main").setTransform({
      positionX: 960,
      positionY: 540,
      scaleX: 1,
      scaleY: 1,
    });
    redemptionEnded("calculating");
  },
});
