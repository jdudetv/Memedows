import { Alignment, SceneItem } from "@sceneify/core";
import { ColorSource } from "@sceneify/sources";
import p2, { Body, Box, Circle, World } from "p2";
import { wait } from "~/utils";
import { bitsScene, mainScene, plinkoScene } from "../Main";

import { toDegrees, toRadians } from "./utils";

export const sceneItems = new Map<SceneItem, PhysicsItemData>();

export let plinkoWorld: World;

let physicsRunning = false;

export async function setupPlinko() {
  stopPlinko();
  plinkoWorld?.clear();

  plinkoWorld = new World({
    gravity: [0, 98 * 10],
  });

  plinkoWorld.defaultContactMaterial.restitution = 0.7;

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
      height: 2000,
      x: 1710,
      y: 1080 / 2,
    },
    {
      //left wall
      width: 1000,
      height: 2000,
      x: 210,
      y: 1080 / 2,
    },
    {
      width: 10,
      height: 50,
      x: 810,
      y: 920,
    },
    {
      width: 10,
      height: 50,
      x: 910,
      y: 920,
    },
    {
      width: 10,
      height: 50,
      x: 1010,
      y: 920,
    },
    {
      width: 10,
      height: 50,
      x: 1110,
      y: 920,
    },
    {
      width: 10,
      height: 50,
      x: 760,
      y: 920,
    },
    {
      width: 10,
      height: 50,
      x: 860,
      y: 920,
    },
    {
      width: 10,
      height: 50,
      x: 960,
      y: 920,
    },
    {
      width: 10,
      height: 50,
      x: 1060,
      y: 920,
    },
    {
      width: 10,
      height: 50,
      x: 1160,
      y: 920,
    },
  ];

  for (const [index, item] of borders.entries()) {
    console.log(item.height + ": " + item.width);
    // await plinkoScene.createItem(`block${index}`, {
    //   source: new ColorSource({
    //     name: `block${index}`,
    //     settings: {
    //       height: item.height,
    //       width: item.width,
    //       color: 0xffffffff,
    //     }
    //   }),
    //   positionX: item.x,
    //   positionY: item.y,
    //   alignment: Alignment.Center,
    // });

    let shape = new Box({
      width: item.width,
      height: item.height,
    });

    let body = new Body({
      position: [item.x, item.y],
    });

    body.addShape(shape);
    plinkoWorld.addBody(body);
  }

  let plinkoHeight = 250;
  // dots
  let dotHeight = 16;
  let dotWidth = 11;
  let xoffset = 712;
  let xSpacing = 49.4;
  let ySpacing = 70;
  let offsetSpacing = 25;

  for (var i = 0; i < dotHeight; i++) {
    let numberWide = dotWidth;
    let offset = 0;
    if (i % 2 == 0) {
      numberWide = dotWidth - 1;
      offset = offsetSpacing;
    }
    for (let j = 0; j < numberWide; j++) {
      let shape = new Circle({
        radius: 5,
      });

      let body = new Body({
        position: [
          xoffset + j * xSpacing + offset,
          plinkoHeight + (ySpacing * i) / 1.8,
        ],
      });
      body.addShape(shape);
      plinkoWorld.addBody(body);
      //   await plinkoScene.createItem(`block${i}_${j}`, {
      //   source: new ColorSource({
      //     name: `block${i}_${j}`,
      //     settings: {
      //       height: 10,
      //       width: 10,
      //       color: 0xffffffff,
      //     }
      //   }),
      //   positionX: xoffset + j * xSpacing + offset,
      //   positionY: plinkoHeight + ySpacing * i/1.8,
      //   alignment: Alignment.Center,
      // });
    }
  }
}

export function startPlinkoPhysics() {
  if (physicsRunning) return;

  for (let [, data] of sceneItems) {
    data.updateBounds();
  }

  physicsRunning = true;

  physicsTick();
}

export function stopPlinko() {
  physicsRunning = false;
  for (let [, item] of sceneItems) {
    item.body.velocity = [0, 0];
  }
}

export function pauseBits() {
  physicsRunning = false;
}

export function getPlinko(item: SceneItem) {
  return sceneItems.get(item)?.body;
}

export function updateBoundsForPlinko(item: SceneItem) {
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
    plinkoWorld.addBody(this.body);

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

export function registerPlinkoItem(
  item: SceneItem,
  options?: PhysicsRegisterOptions
) {
  let data = new PhysicsItemData(item, options);
  data.updateBounds();
  sceneItems.set(item, data);
}

export function unregisterPlinkoItem(item: SceneItem) {
  const data = sceneItems.get(item);
  if (!data) return;
  plinkoWorld.removeBody(data.body);
  sceneItems.delete(item);
}

async function physicsTick(): Promise<void> {
  const timestamp = performance.now();
  plinkoWorld.step(1 / 60);
  plinkoWorld.gravity = [0, 600];
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
