import { createRedemptionHandler, redemptionEnded } from "./base";
import { asset, wait } from "~/utils";
import { GenericSound } from "~/obs/redemptions";
import { MirrorSource } from "~/obs/sources/Mirror";
import { ImageMaskBlendFilter, MaskBlendType } from "@sceneify/filters";
import { Alignment, Scene } from "@sceneify/core";
import { mainScene, obs } from "~/obs/Main";
import { unregisterPhysicsItem } from "~/obs/physics";
import { animate, Easing, keyframe } from "@sceneify/animation";
import { roofBody } from "~/obs/physics/bodies";

createRedemptionHandler({
  event: "silence",
  handler: async (data) => {
    console.log("test");
    GenericSound("Silence", asset`sounds/silence.mp3`, -20, true, 0);

    let SliceScene = await new Scene({
      name: "SliceScene",
      items: {
        Slice1: {
          source: new MirrorSource({
            name: "Slice1",
            settings: {
              "Source.Mirror.Source": "Webcam Window",
            },
            filters: {
              Slice: new ImageMaskBlendFilter({
                name: "slice",
                enabled: false,
                settings: {
                  image_path: asset`images/Slice2.png`,
                  type: MaskBlendType.AlphaMaskColourChannel,
                },
              }),
            },
          }),
          positionX: 960,
          positionY: 540,
          alignment: Alignment.Center,
        },
        Slice2: {
          source: new MirrorSource({
            name: "Slice2",
            settings: {
              "Source.Mirror.Source": "Webcam Window",
            },
            filters: {
              Slice: new ImageMaskBlendFilter({
                name: "slice",
                enabled: false,
                settings: {
                  image_path: asset`images/Slice1.png`,
                  type: MaskBlendType.AlphaMaskColourChannel,
                },
              }),
            },
          }),
          positionX: 960,
          positionY: 540,
          alignment: Alignment.Center,
        },
      },
    }).create(obs);
    unregisterPhysicsItem(mainScene.item("cameraWindow"));
    await SliceScene.item("Slice1").source.filter("Slice").setEnabled(true);
    await SliceScene.item("Slice2").source.filter("Slice").setEnabled(true);
    await mainScene
      .item("cameraWindow")
      .source.filter("FreezeFrame")
      .setEnabled(true);
    await mainScene.createItem("SliceMain", {
      source: SliceScene,
      positionX: mainScene.item("cameraWindow").transform.positionX,
      positionY: mainScene.item("cameraWindow").transform.positionY,
      rotation: mainScene.item("cameraWindow").transform.rotation,
      alignment: Alignment.Center,
    });
    mainScene.item("cameraWindow").setEnabled(false);

    animate({
      subjects: {
        TopHalf: SliceScene.item("Slice1"),
        BotHalf: SliceScene.item("Slice2"),
      },
      keyframes: {
        TopHalf: {
          positionX: {
            10000: keyframe(800, Easing.In),
          },
          positionY: {
            10000: keyframe(300, Easing.In),
          },
          rotation: {
            10000: keyframe(-20, Easing.In),
          },
        },
        BotHalf: {
          positionX: {
            10000: keyframe(1100, Easing.In),
          },
          positionY: {
            10000: keyframe(700, Easing.In),
          },
          rotation: {
            10000: keyframe(20, Easing.In),
          },
        },
      },
    });

    redemptionEnded("silence");
  },
});
