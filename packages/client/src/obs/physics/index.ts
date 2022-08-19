import { Alignment, SceneItem } from "@sceneify/core";
import { Body, Box, Circle, World } from "p2";
import { wait } from "~/utils";

import { toDegrees, toRadians } from "./utils";

export const sceneItems = new Map<
  SceneItem,
  PhysicsItemData | CirclePhysicsItem
>();

export let world: World;

let physicsRunning = false;

export function setupPhysics() {
  stopPhysics();
  world?.clear();

  world = new World({
    gravity: [0, 98 * 10],
  });

  const borders: { width: number; height: number; x: number; y: number }[] = [
    {
      width: 1920,
      height: 1000,
      x: 1920 / 2,
      y: 1080 + 500 - 40,
    },
    {
      width: 1920,
      height: 100,
      x: 1920 / 2,
      y: -3000,
    },
    {
      width: 1000,
      height: 10800,
      x: 1920 + 500,
      y: 1080 / 2,
    },
    {
      width: 1000,
      height: 10800,
      x: -500,
      y: 1080 / 2,
    },
  ];

  borders.forEach(({ width, height, x, y }) => {
    let shape = new Box({
      width,
      height,
    });

    let body = new Body({
      position: [x, y],
    });

    body.addShape(shape);
    world.addBody(body);
  });
}

setupPhysics();

export function startPhysics() {
  if (physicsRunning) return;

  for (let [, data] of sceneItems) {
    data.updateBounds();
  }

  physicsRunning = true;

  physicsTick();
}

export function stopPhysics() {
  physicsRunning = false;
  for (let [, item] of sceneItems) {
    item.body.velocity = [0, 0];
  }
}

export function pausePhyics() {
  physicsRunning = false;
}

export function getBody(item: SceneItem) {
  return sceneItems.get(item)?.body;
}

export function updateBoundsForItem(item: SceneItem) {
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

interface circleRegisterOptions {
  getBounds?: () => {
    radius: number;
    offset?: {
      x: number;
      y: number;
    };
  };
  mass?: number;
}

class CirclePhysicsItem {
  body: Body;
  circle: Circle;

  originalAlignment: Alignment;

  constructor(public item: SceneItem, public options?: circleRegisterOptions) {
    this.body = new Body({
      mass: options?.mass ?? 50,
    });
    world.addBody(this.body);

    this.circle = new Circle({
      radius: item.transform.width / 2,
    });
    this.body.addShape(this.circle);

    this.originalAlignment = item.transform.alignment;
  }

  getBounds() {
    const custom = this.options?.getBounds ? this.options.getBounds() : {};

    return {
      radius: this.item.transform.width / 2,
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

    this.body.removeShape(this.circle);

    this.circle = new Circle({
      radius: this.item.transform.width / 2,
    });

    this.body.addShape(this.circle, [-bounds.offset.x, -bounds.offset.y]);

    this.body.position = [
      this.item.transform.positionX,
      this.item.transform.positionY,
    ];

    this.body.angle = toRadians(this.item.transform.rotation);
  }
}

class PhysicsItemData {
  body: Body;
  box: Box;

  originalAlignment: Alignment;

  constructor(public item: SceneItem, public options?: PhysicsRegisterOptions) {
    this.body = new Body({
      mass: options?.mass ?? 50,
    });
    world.addBody(this.body);

    this.box = new Box({
      width: item.transform.width,
      height: item.transform.height,
    });
    this.body.addShape(this.box);

    this.originalAlignment = item.transform.alignment;
  }

  getBounds() {
    const custom = this.options?.getBounds ? this.options.getBounds() : {};
    console.log(this.item.transform);

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

    this.box = new Box({
      width: bounds.width,
      height: bounds.height,
    });

    this.body.addShape(this.box, [-bounds.offset.x, -bounds.offset.y]);

    this.body.position = [
      this.item.transform.positionX,
      this.item.transform.positionY,
    ];

    this.body.angle = toRadians(this.item.transform.rotation);
  }
}

export function registerPhysicsItem(
  item: SceneItem,
  options?: PhysicsRegisterOptions
) {
  let data = new PhysicsItemData(item, options);
  data.updateBounds();
  sceneItems.set(item, data);
}

export function registerPhysicsCircle(
  item: SceneItem,
  options?: circleRegisterOptions
) {
  let data = new CirclePhysicsItem(item, options);
  data.updateBounds();
  sceneItems.set(item, data);
}

export function unregisterPhysicsItem(item: SceneItem) {
  const data = sceneItems.get(item);
  if (!data) return;
  world.removeBody(data.body);
  sceneItems.delete(item);
}

async function physicsTick(): Promise<void> {
  const timestamp = performance.now();
  world.step(1 / 60);
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
