import { createRedemptionHandler, redemptionEnded } from "./base";
import { greenScreenCameraScene, mainScene, obs } from "~/obs/Main";
import { Alignment } from "@sceneify/core";
import { v4 as uuidv4 } from "uuid";
import { asset, wait } from "~/utils";
import { GenericSound } from "~/obs/redemptions";
import { animate, Easing, keyframe } from "@sceneify/animation";
import { registerMotionBlurItem } from "~/obs/motionBlur";

createRedemptionHandler({
  event: "pizzatime",
  handler: async (data) => {
    GenericSound("PizzaShort", asset`sounds/short.mp3`, 0);
    setTimeout(() => {
      GenericSound("Pizza", asset`sounds/pizza.mp3`, 0);
    }, 3000);
    for (let i = 0; i <= 8; i++) {
      let Pizza = await mainScene.createItem(`PizzaSlice${i + 9}`, {
        source: greenScreenCameraScene,
        rotation: i * 45,
        positionX: 960,
        positionY: 540,
        alignment: Alignment.CenterRight,
        cropRight: 600,
        scaleX: 0.8,
        scaleY: 0.8,
        enabled: false,
      });

      setTimeout(() => {
        Pizza.setEnabled(true);

        animate({
          subjects: {
            pizza: Pizza,
          },
          keyframes: {
            pizza: {
              rotation: {
                24000: keyframe(Pizza.transform.rotation - 2000, Easing.Linear),
              },
            },
          },
        });
        setTimeout(() => {
          Pizza.remove();
        }, 24000);
      }, 5000);
    }
    for (let i = 0; i <= 8; i++) {
      let Pizza = await mainScene.createItem(`PizzaSlice${i}`, {
        source: greenScreenCameraScene,
        rotation: i * 45,
        positionX: 960,
        positionY: 540,
        alignment: Alignment.CenterRight,
        cropRight: 600,
        scaleX: 0.6,
        scaleY: 0.6,
        enabled: false,
      });

      setTimeout(() => {
        Pizza.setEnabled(true);

        animate({
          subjects: {
            pizza: Pizza,
          },
          keyframes: {
            pizza: {
              rotation: {
                24000: keyframe(Pizza.transform.rotation + 2000, Easing.Linear),
              },
            },
          },
        });
        setTimeout(() => {
          Pizza.remove();
        }, 24000);
      }, 5000);
    }
    await wait(30000);
    redemptionEnded("pizzatime");
  },
});
