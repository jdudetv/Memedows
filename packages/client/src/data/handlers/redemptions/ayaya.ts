import { createRedemptionHandler, redemptionEnded } from "./base";
import {
  createVideoWindow,
  GenericVideo,
  TTSFunction,
} from "~/obs/redemptions";
import { mainScene } from "~/obs/Main";
import { videosStore } from "~/data/stores/videos";
import { asset, wait } from "~/utils";
import { TMIClient } from "~/data/services/emotes";
import { MirrorSource } from "~/obs/sources/Mirror";
import { Alignment } from "@sceneify/core";
import { ImageMaskBlendFilter, MaskBlendType } from "@sceneify/filters";
import { convert } from "~/utils/keyframes";
import { animate } from "@sceneify/animation";
import { FaceTracker, ThreeDTransform } from "~/obs/filters";

createRedemptionHandler({
  event: "ayaya",
  handler: async (data) => {
    let Mirror = new MirrorSource({
      name: "ZCAMMIRROR",
      settings: {
        "Source.Mirror.Source": "ZCAM",
      },
    });

    GenericVideo("AYAYA", mainScene, asset`ayaya/Ayaya.mp4`);
    await wait(100);

    let MirrorAdded = await mainScene.createItem("MirrorAYAYA", {
      source: Mirror,
      scaleX: 0.2,
      scaleY: 0.2,
      alignment: Alignment.Center,
    });

    await MirrorAdded.source.addFilter(
      "3dOFFSET",
      new ThreeDTransform({
        name: "3dOFFSET",
        settings: {
          "Position.X": -5,
          "Position.Y": 20,
        },
      })
    );

    await MirrorAdded.source.addFilter(
      "MASK",
      new ImageMaskBlendFilter({
        name: "MASK",
        settings: {
          type: MaskBlendType.AlphaMaskAlphaChannel,
          image_path: asset`ayaya/face.png`,
        },
      })
    );

    let Data = convert(asset`ayaya/AYAYA.json`, "cam", 0.5, 0, -70, 0);
    await wait(400);
    await animate({
      subjects: {
        Main: MirrorAdded,
      },
      keyframes: {
        Main: {
          positionX: Data.positionX,
          positionY: Data.positionY,
          scaleX: Data.scaleX,
          scaleY: Data.scaleY,
        },
      },
    });

    MirrorAdded.remove();

    redemptionEnded("ayaya");
  },
});
