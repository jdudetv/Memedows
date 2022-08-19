import { Alignment, Scene } from "@sceneify/core";
import {
  ColorCorrectionFilter,
  ImageMaskBlendFilter,
  MaskBlendType,
} from "@sceneify/filters";
import { ImageSource } from "@sceneify/sources";
import { greenScreenCameraScene, mainScene, obs } from "~/obs/Main";
import { GenericSound } from "~/obs/redemptions";
import { asset, wait } from "~/utils";
import { createRedemptionHandler, redemptionEnded } from "./base";

const cowboyPos = [
  { x: 700 },
  { x: 763 },
  { x: 1382 },
  { x: 731 },
  { x: 1513 },
  { x: 696 },
  { x: 1530 },
  { x: 690 },
];
let XFlip = false;
createRedemptionHandler({
  event: "cowboy",
  handler: async (data) => {
    GenericSound("Cowboy", asset`sounds/cowboy.mp3`, -10);
    await wait(13000);
    let CowboyScene = await new Scene({
      name: "CowboyScene",
      items: {
        CowboyCam: {
          source: greenScreenCameraScene,
          positionX: 960,
          positionY: 840,
          alignment: Alignment.Center,
          scaleX: 1.78,
          scaleY: 1.78,
          rotation: 90,
        },
      },
    }).create(obs);
    CowboyScene.addFilter(
      "Fadeout",
      new ImageMaskBlendFilter({
        name: "Fadeout",
        settings: {
          image_path: asset`cowboy/transparency.png`,
          type: MaskBlendType.AlphaMaskAlphaChannel,
        },
      })
    );

    CowboyScene.addFilter(
      "Opacity",
      new ColorCorrectionFilter({
        name: "Opacity",
        settings: {
          opacity: 0.85,
        },
      })
    );

    let Cowboy = await mainScene.createItem(`Cowboy Back`, {
      source: new ImageSource({
        name: `Cowboy Back`,
        settings: {
          file: `L:/Streaming/assets/cowboy/Cowboy.jpg`,
        },
      }),
      scaleX: 0.75,
      scaleY: 0.75,
    });

    let GSC = await mainScene.createItem(`Cowboy Cam`, {
      source: CowboyScene,
      rotation: 0,
      positionX: 960,
      positionY: 450,
      alignment: Alignment.Center,
      scaleX: 0.75,
      scaleY: 0.75,
    });
    let CowboyFront = await mainScene.createItem(`Cowboy Front`, {
      source: new ImageSource({
        name: `Cowboy Front`,
        settings: {
          file: `L:/Streaming/assets/cowboy/Cowboy1_front.png`,
        },
      }),
      scaleX: 0.75,
      scaleY: 0.75,
    });

    for (let i = 1; i <= 7; i++) {
      Cowboy.source.setSettings({
        file: `L:/Streaming/assets/cowboy/Cowboy${i}.jpg`,
      });
      CowboyFront.source.setSettings({
        file: `L:/Streaming/assets/cowboy/Cowboy${i}_front.png`,
      });

      GSC.setTransform({
        positionX: cowboyPos[i].x,
        scaleX: XFlip ? 0.75 : -0.75,
      });
      XFlip = !XFlip;
      await wait(4420);
    }

    setTimeout(() => {
      Cowboy.remove();
      CowboyFront.remove();
      GSC.remove();
      CowboyScene.remove();
      setTimeout(() => {
        redemptionEnded("cowboy");
      }, 2000);
    }, 1000);
  },
});
