import { FreetypeTextSource, ImageSource } from "@sceneify/sources";
import { ColorCorrectionFilter } from "@sceneify/filters";
import { localDB } from "~/data/jsondb";

import { asset } from "~/utils";

let hueShift = parseInt(localDB.getData("store/hueShift"));

export const taskbarMain = new ImageSource({
  name: "Taskbar Main",
  settings: {
    file: asset`Taskbar/TaskbarMain.png`,
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

export const startButton = new ImageSource({
  name: "Start Button",
  settings: {
    file: asset`Taskbar/StartBarUp.png`,
  },
});

export const iconTray = new ImageSource({
  name: "Icon Tray",
  settings: {
    file: asset`Taskbar/RightCornerOverlay.png`,
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

export const taskbarClock = new FreetypeTextSource({
  name: "Clock",
  settings: {
    text: "4:20 PM",
    antialiasing: true,
    font: {
      face: "Trebuchet MS",
      flags: 1,
      size: 100,
      style: "Bold",
    },
  },
});

export const taskbarUp = new ImageSource({
  name: "taskbarUp",
  settings: {
    file: asset`Taskbar/TaskbarUp.png`,
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

export const taskbarDown = new ImageSource({
  name: "taskbarDown",
  settings: {
    file: asset`Taskbar/TaskbarDown.png`,
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

export const taskbarNotif = new ImageSource({
  name: "taskbarNotif",
  settings: {
    file: asset`Taskbar/TaskbarNotif.png`,
  },
});
