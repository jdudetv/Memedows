import { Body } from "p2";
import { OBS_SCALE } from "./constants";

export const bitsBody = new Body({
  mass: 5,
  position: [960 / OBS_SCALE, 540 / OBS_SCALE],
  velocity: [0, 0],
  angularDamping: 0.3,
});

export const cameraBody = new Body({
  mass: 50,
  position: [400 / OBS_SCALE, 540 / OBS_SCALE],
  velocity: [0, 0],
  angularDamping: 0.3,
});
cameraBody.damping = 0;

export const chatBody = new Body({
  mass: 50,
  position: [1638 / OBS_SCALE, 528 / OBS_SCALE],
  velocity: [0, 0],
  angularDamping: 0.3,
});

export const musicBody = new Body({
  mass: 50,
  position: [1140 / OBS_SCALE, 907 / OBS_SCALE],
  velocity: [0, 0],
  angularDamping: 0.3,
});
export const roofBody = new Body({
  mass: 0,
  position: [960 / OBS_SCALE, 1130 / OBS_SCALE],
});

export const leftBody = new Body({
  mass: 0,
  position: [1970 / OBS_SCALE, 540 / OBS_SCALE],
});

export const rightBody = new Body({
  mass: 0,
  position: [-50 / OBS_SCALE, 540 / OBS_SCALE],
});

export const groundBody = new Body({
  mass: 0, // Setting mass to 0 makes it static
  position: [960 / OBS_SCALE, -10 / OBS_SCALE],
});
