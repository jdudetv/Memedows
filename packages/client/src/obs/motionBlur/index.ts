import { SceneItem } from "@sceneify/core";
import { wait } from "~/utils";
import { Blur, BlurType } from "../filters";

declare interface PrevLocationData {
  positionX: number;
  positionY: number;
  scaleX: number;
  scaleY: number;
  rotation: number;
}

const MotionBlurItems = new Map<SceneItem, PrevLocationData>();

export function registerMotionBlurItem(item: SceneItem) {
  let data = { ...item.transform } as PrevLocationData;

  // item.source.addFilter(
  //   "rotationBlur",
  //   new Blur({
  //     name: "RotationalBlur",
  //     settings: {
  //       "Filter.Blur.Type": "gaussian",
  //       "Filter.Blur.SubType": "rotational",
  //       "Filter.Blur.Size": 10,
  //       "Filter.Blur.Angle": 0,
  //     },
  //   })
  // );

  MotionBlurItems.set(item, data);
}

export function unregisterMotionBlurItem(item: SceneItem) {
  MotionBlurItems.delete(item);
}

function AngleCalc(A: number, H: number) {
  return Math.acos(A / H);
}

function sqr(val: number) {
  return val * val;
}

export async function MotionBlurTick(): Promise<void> {
  const timestamp = performance.now();
  MotionBlurItems.forEach((item, index) => {
    let xChange = index.transform.positionX - item.positionX;
    let yChange = index.transform.positionY - item.positionY;
    let RotChange = Math.abs(
      Math.round(index.transform.rotation * 100) / 100 -
        Math.round(item.rotation * 100) / 100
    );
    let Amount = Math.sqrt(sqr(xChange) + sqr(yChange));
    let Angle = AngleCalc(xChange, yChange) - (index.transform.rotation % 360);
    item = { ...index.transform };
    if (RotChange == 0) return;

    for (let ref in index.source.filters) {
      let filter = index.source.filters[ref];

      if (filter.name == "RotationalBlur") {
        filter.setSettings({
          "Filter.Blur.Angle": Math.round(RotChange * 100) / 100 / 4,
        });
      }
    }
  });

  await wait(1000 / 60 - (performance.now() - timestamp));
  MotionBlurTick();
}
