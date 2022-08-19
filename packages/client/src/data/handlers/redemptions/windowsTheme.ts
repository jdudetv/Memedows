import { ImageSource } from "@sceneify/sources";
import { animate } from "@sceneify/animation";
import { localDB } from "~/data/jsondb";
import { SSPSource } from "~/obs/sources/SSP";
import {
  iconTray,
  taskbarDown,
  taskbarMain,
  taskbarUp,
  windowBottom,
  windowBottomLeft,
  windowBottomRight,
  windowLeft,
  windowRight,
  windowTop,
  windowTopLeft,
  windowTopRightCutout,
} from "~/obs/sprites";
import { StartMenuBack } from "~/obs/startMenu";
// import { StartMenu, StartMenuBack } from "~/obs/startMenu";
import { wait } from "~/utils";
import { createRedemptionHandler, redemptionEnded } from "./base";
const hueList = [
  windowBottom,
  windowRight,
  windowLeft,
  windowTop,
  windowBottomRight,
  windowBottomLeft,
  windowTopRightCutout,
  windowTopLeft,
  taskbarMain,
  iconTray,
  taskbarUp,
  taskbarDown,
  StartMenuBack,
];

createRedemptionHandler({
  event: "WindowsTheme",
  handler: async (data) => {
    for (let [index, source] of hueList.entries()) {
      console.log(source.name);
      animate({
        subjects: {
          animationSubject: source.filter("HUE"),
        },
        keyframes: {
          animationSubject: {
            hue_shift: {
              1000: parseInt(data.input) % 360,
            },
          },
        },
      });
    }

    await wait(1100);
    localDB.push("store/hueShift", data.input);
    redemptionEnded("windowstheme");
  },
});
