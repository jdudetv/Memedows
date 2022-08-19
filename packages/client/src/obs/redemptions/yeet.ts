import { redemptionEnded } from "~/data/handlers/redemptions/base";
import { wait } from "~/utils";
import { mainScene } from "../Main";
import { getBody } from "../physics";
import { WindowItem } from "../Window";

const forcePhysicsItems = ["cameraWindow"];

export async function yeet() {
  await wait(50);
  for (let itemName in mainScene.items) {
    let item = mainScene.items[itemName];

    if (forcePhysicsItems.includes(itemName) && getBody(item) === undefined)
      (item as WindowItem<any>).registerPhysics();
    else {
      if (getBody(item) === undefined) continue;
    }

    console.log(item);
    const body = getBody(item)!;
    const angle = Math.random() * Math.PI;
    body.velocity = [
      1000 * Math.cos(angle) + body.velocity[0],
      -Math.sin(angle) * 1000 + body.velocity[1],
    ];
    body.angularVelocity = (Math.random() - 0.5) * 15;
  }
}
