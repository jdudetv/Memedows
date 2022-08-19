import fs from "fs";
import { KeyframeProperty, KeyframesFromSchema } from "@sceneify/animation";

export function convert(
  filename: string,
  object: string,
  SCALEOFF = 1,
  XOFF = 0,
  YOFF = 0,
  ROTOFF = 0
) {
  try {
    const data = JSON.parse(fs.readFileSync(filename, "utf-8"));

    let position = data[object].position;
    let scale = data[object].scale;
    let rotation = data[object].rotation;
    let JSOB: Record<string, Record<number, KeyframeProperty>> = {
      positionX: {},
      positionY: {},
      rotation: {},
      scaleX: {},
      scaleY: {},
    };

    if (position) {
      for (let data of position) {
        let Time = Math.round(data[0] * 1000);
        JSOB.positionX[Time] = data[1] + XOFF;
        JSOB.positionY[Time] = data[2] + YOFF;
      }
    }
    if (scale) {
      for (let data of scale) {
        let Time = Math.round(data[0] * 1000);
        JSOB.scaleX[Time] = (data[1] / 100) * SCALEOFF;
        JSOB.scaleY[Time] = (data[2] / 100) * SCALEOFF;
      }
    }
    if (rotation) {
      for (let data of rotation) {
        let Time = Math.round(data[0] * 1000);
        JSOB.rotation[Time] = data[1] + ROTOFF;
      }
    }

    return JSOB as any;
  } catch (err) {
    console.log(err);
  }
}
