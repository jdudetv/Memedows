import { Alignment, SceneItem } from "@sceneify/core";
import { ColorSource } from "@sceneify/sources";
import { Body, Box, Circle, World } from "p2";
import { wait } from "~/utils";
import { bitsScene, mainScene } from "../Main";

import { toDegrees, toRadians } from "./utils";

export const sceneItems = new Map<SceneItem, PhysicsItemData>();

export let bitsWorld: World;

let physicsRunning = false;

export function setupBits() {
  stopBits();
  bitsWorld?.clear();

  bitsWorld = new World({
    gravity: [0, 98 * 10],
  });

  const borders: { width: number; height: number; x: number; y: number }[] = [
    {
      //floor
      width: 1920,
      height: 1000,
      x: 1920 / 2,
      y: 1080 + 360,
    },
    {
      //roof
      width: 1920,
      height: 1000,
      x: 1920 / 2,
      y: -360,
    },
    {
      //right wall
      width: 1000,
      height: 10800,
      x: 1710,
      y: 1080 / 2,
    },
    {
      //left wall
      width: 1000,
      height: 10800,
      x: 210,
      y: 1080 / 2,
    },
    {
      width: 10,
      height: 700,
      x: 920,
      y: 490,
    },
    {
      width: 10,
      height: 700,
      x: 1000,
      y: 490,
    },
    {
      width: 10,
      height: 340,
      x: 865,
      y: 725,
    },
    {
      width: 10,
      height: 340,
      x: 1055,
      y: 725,
    },
    {
      width: 10,
      height: 330,
      x: 1055,
      y: 345,
    },
    {
      width: 10,
      height: 330,
      x: 865,
      y: 345,
    },
    {
      width: 400,
      height: 10,
      x: 960,
      y: 890,
    },
    {
      width: 100,
      height: 10,
      x: 810,
      y: 780,
    },
    {
      width: 100,
      height: 10,
      x: 760,
      y: 835,
    },
    {
      width: 100,
      height: 10,
      x: 810,
      y: 670,
    },
    {
      width: 100,
      height: 10,
      x: 760,
      y: 725,
    },
    {
      width: 100,
      height: 10,
      x: 810,
      y: 560,
    },
    {
      width: 100,
      height: 10,
      x: 760,
      y: 615,
    },
    {
      width: 100,
      height: 10,
      x: 1110,
      y: 780,
    },
    {
      width: 100,
      height: 10,
      x: 1160,
      y: 835,
    },
    {
      width: 100,
      height: 10,
      x: 1110,
      y: 670,
    },
    {
      width: 100,
      height: 10,
      x: 1160,
      y: 725,
    },
    {
      width: 100,
      height: 10,
      x: 1110,
      y: 560,
    },
    {
      width: 100,
      height: 10,
      x: 1160,
      y: 615,
    },
    {
      width: 100,
      height: 10,
      x: 1110,
      y: 185,
    },
    {
      width: 100,
      height: 10,
      x: 1110,
      y: 285,
    },
    {
      width: 100,
      height: 10,
      x: 1160,
      y: 230,
    },
    {
      width: 100,
      height: 10,
      x: 1110,
      y: 395,
    },
    {
      width: 100,
      height: 10,
      x: 1160,
      y: 340,
    },
    {
      width: 160,
      height: 10,
      x: 1080,
      y: 505,
    },
    {
      width: 100,
      height: 10,
      x: 810,
      y: 185,
    },
    {
      width: 100,
      height: 10,
      x: 810,
      y: 285,
    },
    {
      width: 100,
      height: 10,
      x: 760,
      y: 230,
    },
    {
      width: 100,
      height: 10,
      x: 810,
      y: 395,
    },
    {
      width: 100,
      height: 10,
      x: 760,
      y: 340,
    },
    {
      width: 160,
      height: 10,
      x: 840,
      y: 505,
    },
    {
      width: 100,
      height: 10,
      x: 760,
      y: 450,
    },
    {
      width: 10,
      height: 50,
      x: 960,
      y: 915,
    },
  ];

  borders.forEach(({ width, height, x, y }, index) => {
    // bitsScene.createItem(`block${index}`, {
    //   source: new ColorSource({
    //     name: `block${index}`,
    //     settings: {
    //       height,
    //       width,
    //       color: 0xffffffff,
    //     }
    //   }),
    //   positionX: x,
    //   positionY: y,
    //   alignment: Alignment.Center,
    // });

    let shape = new Box({
      width,
      height,
    });

    let body = new Body({
      position: [x, y],
    });

    body.addShape(shape);
    bitsWorld.addBody(body);
  });
}

export function startBitsPhysics() {
  if (physicsRunning) return;

  for (let [, data] of sceneItems) {
    data.updateBounds();
  }

  physicsRunning = true;

  physicsTick();
}

export function stopBits() {
  physicsRunning = false;
  for (let [, item] of sceneItems) {
    item.body.velocity = [0, 0];
  }
}

export function pauseBits() {
  physicsRunning = false;
}

export function getBits(item: SceneItem) {
  return sceneItems.get(item)?.body;
}

export function updateBoundsForBits(item: SceneItem) {
  const data = sceneItems.get(item);
  if (!data) return;

  data.updateBounds();
}

interface PhysicsRegisterOptions {
  getBounds?: () => {
    width?: number;
    height?: number;
    offset?: {
      x: number;
      y: number;
    };
  };
  mass?: number;
}

class PhysicsItemData {
  body: Body;
  box: Circle;

  originalAlignment: Alignment;

  constructor(public item: SceneItem, public options?: PhysicsRegisterOptions) {
    this.body = new Body({
      mass: options?.mass ?? 50,
    });
    bitsWorld.addBody(this.body);

    this.box = new Circle({
      radius: item.transform.width / 2,
    });
    this.body.addShape(this.box);

    this.originalAlignment = item.transform.alignment;
  }

  getBounds() {
    const custom = this.options?.getBounds ? this.options.getBounds() : {};

    return {
      width: this.item.transform.width,
      height: this.item.transform.height,
      rotation: this.item.transform.rotation,
      offset: {
        x: 0,
        y: 0,
      },
      ...custom,
    };
  }

  updateBounds() {
    const bounds = this.getBounds();

    this.body.removeShape(this.box);

    this.box = new Circle({
      radius: bounds.width / 2,
    });

    this.body.addShape(this.box, [-bounds.offset.x, -bounds.offset.y]);

    this.body.position = [
      this.item.transform.positionX,
      this.item.transform.positionY,
    ];

    this.body.angle = toRadians(this.item.transform.rotation);
  }
}

export function registerBitsItem(
  item: SceneItem,
  options?: PhysicsRegisterOptions
) {
  let data = new PhysicsItemData(item, options);
  data.updateBounds();
  sceneItems.set(item, data);
}

export function unregisterBitsItem(item: SceneItem) {
  const data = sceneItems.get(item);
  if (!data) return;
  bitsWorld.removeBody(data.body);
  sceneItems.delete(item);
}

async function physicsTick(): Promise<void> {
  const timestamp = performance.now();
  bitsWorld.step(1 / 60);
  let rotation = Math.abs(
    mainScene.item("bitsWindow").transform.rotation > 0
      ? mainScene.item("bitsWindow").transform.rotation
      : 360 - Math.abs(mainScene.item("bitsWindow").transform.rotation)
  );
  let ygrav = Math.round((Math.abs((rotation - 180) / 90) - 1) * 980);
  let xgrav = Math.round(
    (Math.abs((((rotation + 270) % 360) - 180) / 90) - 1) * 980
  );
  bitsWorld.gravity = [xgrav, ygrav];
  sceneItems.forEach((item) => {
    item.item.setTransform({
      positionX: item.body.position[0],
      positionY: item.body.position[1],
      rotation: toDegrees(item.body.angle) % 360,
    });
  });
  await wait(1000 / 90); //- (performance.now() - timestamp)
  if (physicsRunning) return physicsTick();
}
