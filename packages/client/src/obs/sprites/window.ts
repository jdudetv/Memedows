import { ImageSource } from "@sceneify/sources";
import { ColorCorrectionFilter } from "@sceneify/filters";
import { localDB } from "~/data/jsondb";

import { asset } from "~/utils";

let hueShift = parseInt(localDB.getData("store/hueShift"));

export const windowBottom = new ImageSource({
  name: "WindowBottom",
  settings: {
    file: asset`sprites/Bottom.png`,
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

export const windowRight = new ImageSource({
  name: "WindowRight",
  settings: {
    file: asset`sprites/Right.png`,
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

export const windowLeft = new ImageSource({
  name: "WindowLeft",
  settings: {
    file: asset`sprites/Left.png`,
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

export const windowTop = new ImageSource({
  name: "WindowTop",
  settings: {
    file: asset`sprites/Top.png`,
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

export const windowBottomRight = new ImageSource({
  name: "WindowBottomRight",
  settings: {
    file: asset`sprites/Bottom Right.png`,
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

export const windowBottomLeft = new ImageSource({
  name: "WindowBottomLeft",
  settings: {
    file: asset`sprites/Bottom Left.png`,
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

export const windowTopRight = new ImageSource({
  name: "WindowTopRight",
  settings: {
    file: asset`sprites/Top Right.png`,
  },
});

export const windowTopRightCutout = new ImageSource({
  name: "WindowTopRightCutout",
  settings: {
    file: asset`sprites/Top Right Cutout.png`,
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

export const windowTopLeft = new ImageSource({
  name: "WindowTopLeft",
  settings: {
    file: asset`sprites/Top Left.png`,
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
