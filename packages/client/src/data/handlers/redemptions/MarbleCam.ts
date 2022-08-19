import { createRedemptionHandler, redemptionEnded } from "./base";
import { mainScene } from "~/obs/Main";
import { asset, wait } from "~/utils";
import { PixelateShader } from "~/obs/filters";
import { obs } from "@sceneify/core";
import { GenericSound } from "~/obs/redemptions";
import { animate, Easing, keyframe, keyframes } from "@sceneify/animation";
import { keyTap } from "robotjs";

createRedemptionHandler({
  event: "numberselector",
  handler: async (data) => {
    console.log(data.input);
    data.input = data.input.substring(0, 1);
    if (parseInt(data.input) > 0 && parseInt(data.input) < 11)
      keyTap(data.input.toString());
    redemptionEnded("numberselector");
  },
});
