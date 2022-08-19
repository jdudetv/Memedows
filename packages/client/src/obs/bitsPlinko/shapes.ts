import { Box, Circle } from "p2";
import { OBS_SCALE } from "./constants";

export const bitShape = new Circle({
  radius: 75 / OBS_SCALE,
});

export const roofShape = new Box({
  height: 100 / OBS_SCALE,
  width: 1920 / OBS_SCALE,
});

export const leftShape = new Box({
  height: 1080 / OBS_SCALE,
  width: 100 / OBS_SCALE,
});

export const rightShape = new Box({
  height: 1080 / OBS_SCALE,
  width: 100 / OBS_SCALE,
});

export const groundShape = new Box({
  height: 100 / OBS_SCALE,
  width: 1920 / OBS_SCALE,
});
