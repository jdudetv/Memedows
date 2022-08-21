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
    let x = Math.random() < 0.5;
    let y = Math.random() < 0.5;
    bounce();

    async function bounce() {
      console.log("start");
      let TopBound = 0 + height / 2;
      let BottomBound = 1040 - height / 2;
      let LeftBound = 0 + width / 2;
      let RightBound = 1920 - width / 2;
      let travelx;
      let travely;
      let xAnimate: number;
      let yAnimate: number;
      let time: number;

      if (x) {
        travelx = RightBound - LOGO.transform.positionX;
      } else {
        travelx = LOGO.transform.positionX - LeftBound;
      }
      if (y) {
        travely = BottomBound - LOGO.transform.positionY;
      } else {
        travely = LOGO.transform.positionY - TopBound;
      }

      if (travelx > travely) {
        if (x) {
          xAnimate = LOGO.transform.positionX + travely;
        } else {
          xAnimate = LOGO.transform.positionX - travely;
        }

        if (y) {
          yAnimate = LOGO.transform.positionY + travely;
        } else {
          yAnimate = LOGO.transform.positionY - travely;
        }
        time = (travely / 2000) * 1000;
        y = !y;
      } else {
        if (x) {
          xAnimate = LOGO.transform.positionX + travelx;
        } else {
          xAnimate = LOGO.transform.positionX - travelx;
        }

        if (y) {
          yAnimate = LOGO.transform.positionY + travelx;
        } else {
          yAnimate = LOGO.transform.positionY - travelx;
        }
        time = (travelx / 2000) * 1000;
        x = !x;
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
