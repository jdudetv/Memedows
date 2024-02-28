import { createRedemptionHandler, redemptionEnded } from "./base";
import { keyTap, keyToggle, moveMouseSmooth } from "robotjs";
import { MainWrapper } from "~/obs/Main";
import { ColorSource } from "@sceneify/sources";
import { animate, Easing, keyframe } from "@sceneify/animation";
import { Alignment } from "@sceneify/core";

createRedemptionHandler({
  event: "dvd",
  handler: async (data) => {
    let height = 100;
    let width = 100;
    let LOGO = await MainWrapper.createItem("DVDLOGO", {
      source: new ColorSource({
        name: "DVDLOGO",
        settings: {
          height,
          width,
        },
      }),
      positionX: Math.random() * 400 + 200,
      positionY: Math.random() * 1000 + 400,
      alignment: Alignment.Center,
    });
    let xPositive = Math.random() < 0.5;  // Positive x = right, negative = left
    let yPositive = Math.random() < 0.5;  // Positive y = down, negative = up
    bounce();

    async function bounce() {
      console.log("start");
      let TopBound = 0 + height / 2;
      let BottomBound = 1040 - height / 2; // screen height minus 40 for taskbar height
      let LeftBound = 0 + width / 2;
      let RightBound = 1920 - width / 2;
      let travelX; // distance to left or right bound
      let travelY; // distance to top or bottom bound
      let xAnimate: number; // end positions of next animation
      let yAnimate: number;
      let time: number;

      travelX = xPositive ? RightBound - LOGO.transform.positionX : LOGO.transform.positionX - LeftBound;
      travelY = yPositive ? BottomBound - LOGO.transform.positionY : LOGO.transform.positionY - TopBound;

      if (travelX > travelY) {     
        xAnimate = LOGO.transform.positionX + (xPositive ? travelY : -travelY);
        yAnimate = LOGO.transform.positionY + (yPositive ? travelY : -travelY);
        time = (travelY / 2000) * 1000;
        yPositive = !yPositive;
      } else {
        xAnimate = LOGO.transform.positionX + (xPositive ? travelX : -travelX);
        yAnimate = LOGO.transform.positiony + (xPositive ? travelX : -travelX);
        time = (travelX / 2000) * 1000;
        xPositive = !xPositive;
      }

      let xFrame = { [time]: keyframe(xAnimate, Easing.Linear) };
      let yFrame = { [time]: keyframe(yAnimate, Easing.Linear) };

      await animate({
        subjects: {
          Thing: LOGO,
        },
        keyframes: {
          Thing: {
            positionX: xFrame,
            positionY: yFrame,
          },
        },
      });
      bounce();
    }
    redemptionEnded("dvd");
  },
});
