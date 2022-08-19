import { createRedemptionHandler, redemptionEnded } from "./base";
import { cameraScene, mainScene } from "~/obs/Main";
import { asset, wait } from "~/utils";
import { PixelateShader } from "~/obs/filters";
import { ColorCorrectionFilter } from "@sceneify/filters";
import { ImageSource, MediaSource } from "@sceneify/sources";
import { GenericSound } from "~/obs/redemptions";

createRedemptionHandler({
  event: "sadboi",
  handler: async (data) => {
    let rain = await cameraScene.createItem("Rain", {
      source: new ImageSource({
        name: "Rain",
        settings: {
          file: asset`images/tenor.gif`,
        },
      }),
      scaleX: 4,
      scaleY: 4,
    });

    rain.source.addFilter(
      "Transparent",
      new ColorCorrectionFilter({
        name: "Transparent",
        settings: {
          opacity: 0.5,
        },
      })
    );

    GenericSound("SadBoiSound", asset`sounds/sad-violin.mp3`);
    await wait(10000);
    rain.remove();
    redemptionEnded("sadboi");
  },
});
