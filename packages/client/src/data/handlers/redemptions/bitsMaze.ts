import { wait } from "@sceneify/animation";
import { mainScene } from "~/obs/Main";

let rotation = 0;
let Active = false;

export async function rotateanim(number: number) {
  rotation += number;
  console.log(rotation);
  rotating();
}

export async function rotateStop() {
  rotation = 0;
}

async function rotating() {
  while (rotation != 0) {
    await mainScene
      .item("bitsWindow")
      .setTransform({
        rotation:
          (mainScene.item("bitsWindow").transform.rotation + rotation) % 360,
      });
    await wait(17);
  }
}
