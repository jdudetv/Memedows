import { Alignment, Scene } from "@sceneify/core";
import { ColorCorrectionFilter, CropPadFilter } from "@sceneify/filters";
import {
  BrowserSource,
  GDIPlusTextSource,
  ImageSource,
} from "@sceneify/sources";
import { localDB } from "~/data/jsondb";
import { asset } from "~/utils";
import { mainScene } from "./Main";

let RefundData = localDB.getData("store/refund/variables");

let hueShift = parseInt(localDB.getData("store/hueShift"));

export const StartMenuBack = new ImageSource({
  name: "StartMenuBack",
  settings: {
    file: asset`Taskbar/startMenu.png`,
  },
  filters: {
    HUE: new ColorCorrectionFilter({
      name: "HUE",
      settings: {
        hue_shift: hueShift,
      },
    }),
  },
});

export const eventList = new BrowserSource({
  name: "EventList",
  settings: {
    url: "https://streamlabs.com/widgets/event-list/v1/A7D1FC481E79C9B0A4BD",
    height: 800,
    width: 600,
  },
});

export const StartMenu = new Scene({
  name: "StartMenu",
  items: {
    StartMenuBack: {
      source: StartMenuBack,
      positionX: 0,
      positionY: 1080,
      alignment: Alignment.BottomLeft,
    },
    StartMenuFront: {
      source: new ImageSource({
        name: "StartMenuFront",
        settings: {
          file: asset`Taskbar/startMenuFront.png`,
        },
      }),
      positionX: 0,
      positionY: 1080,
      alignment: Alignment.BottomLeft,
    },
    EventListMain: {
      source: eventList,
      positionX: 42,
      positionY: 509,
      cropBottom: 713,
    },
    EventList2: {
      source: eventList,
      positionX: 37,
      positionY: 607,
      cropBottom: 645,
      cropRight: 204,
      cropTop: 85,
      scaleX: 0.5,
      scaleY: 0.5,
    },
    EventList3: {
      source: eventList,
      positionX: 37,
      positionY: 647,
      cropBottom: 570,
      cropRight: 204,
      cropTop: 151,
      scaleX: 0.5,
      scaleY: 0.5,
    },
    EventList4: {
      source: eventList,
      positionX: 37,
      positionY: 701,
      cropBottom: 493,
      cropRight: 204,
      cropTop: 224,
      scaleX: 0.5,
      scaleY: 0.5,
    },
    EventList5: {
      source: eventList,
      positionX: 37,
      positionY: 759,
      cropBottom: 423,
      cropRight: 204,
      cropTop: 296,
      scaleX: 0.5,
      scaleY: 0.5,
    },
    EventList6: {
      source: eventList,
      positionX: 37,
      positionY: 808,
      cropBottom: 352,
      cropRight: 204,
      cropTop: 369,
      scaleX: 0.5,
      scaleY: 0.5,
    },
    EventList7: {
      source: eventList,
      positionX: 37,
      positionY: 852,
      cropBottom: 279,
      cropTop: 443,
      cropRight: 204,
      scaleX: 0.5,
      scaleY: 0.5,
    },
    EventList8: {
      source: eventList,
      positionX: 37,
      positionY: 900,
      cropBottom: 206,
      cropTop: 512,
      cropRight: 204,
      scaleX: 0.5,
      scaleY: 0.5,
    },
    EventList9: {
      source: eventList,
      positionX: 257,
      positionY: 599,
      cropBottom: 135,
      cropTop: 584,
      cropRight: 227,
      scaleX: 0.5,
      scaleY: 0.5,
    },
    EventList10: {
      source: eventList,
      positionX: 257,
      positionY: 640,
      cropBottom: 51,
      cropTop: 655,
      cropRight: 227,
      scaleX: 0.5,
      scaleY: 0.5,
    },
    SubGoal: {
      source: new GDIPlusTextSource({
        name: "SubGoal",
        settings: {
          text:
            "SUBS " +
            parseInt(RefundData.subscriptionAmount) +
            " / " +
            parseInt(RefundData.subscriptionThreshold) *
              parseInt(RefundData.subscriptionMultiplier),
          color: 0xff000000,
          font: {
            face: "Comic Sans MS",
            style: "Regular",
            size: 25,
          },
          align: "left",
        } as any,
      }),
      positionX: 273,
      positionY: 818,
      alignment: Alignment.CenterLeft,
    },
    DonoGoal: {
      source: new GDIPlusTextSource({
        name: "DonoGoal",
        settings: {
          text:
            "DONO $" +
            parseFloat(RefundData.donationAmount) / 100 +
            " / $" +
            (parseInt(RefundData.donationThreshold) *
              parseInt(RefundData.donationMultiplier)) /
              100,
          color: 0xff000000,
          font: {
            face: "Comic Sans MS",
            style: "Regular",
            size: 25,
          },
          align: "left",
        } as any,
      }),
      positionX: 273,
      positionY: 855,
      alignment: Alignment.CenterLeft,
    },
    BitsGoal: {
      source: new GDIPlusTextSource({
        name: "BitsGoal",
        settings: {
          text:
            "BITS " +
            parseInt(RefundData.cheerAmount) +
            " / " +
            parseInt(RefundData.cheerThreshold) *
              parseInt(RefundData.cheerMultiplier),
          color: 0xff000000,
          font: {
            face: "Comic Sans MS",
            style: "Regular",
            size: 25,
          },
          align: "left",
        } as any,
      }),
      positionX: 273,
      positionY: 892,
      alignment: Alignment.CenterLeft,
    },
    FreeTier: {
      source: new GDIPlusTextSource({
        name: "FreeTier",
        settings: {
          text: `Free Redemption\n${RefundData.FreeTier}`,
          color: 0xff000000,
          font: {
            face: "Comic Sans MS",
            style: "Regular",
            size: 25,
          },
          align: "center",
        } as any,
      }),
      positionX: 272,
      positionY: 946,
      alignment: Alignment.CenterLeft,
    },
  },
});

export function toggleStartMenu() {
  mainScene
    .item("StartMenu")!
    .setEnabled(!mainScene.item("StartMenu")!.enabled);
}
