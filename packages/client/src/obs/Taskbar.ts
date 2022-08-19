import { Alignment, Scene, SceneItem, OBS } from "@sceneify/core";
import { GDIPlusTextSource, ImageSource } from "@sceneify/sources";
import { ColorCorrectionFilter } from "@sceneify/filters";
import { keyframes, animate, Keyframes } from "@sceneify/animation";
import { action, observable, reaction, toJS } from "mobx";

import { asset, getTime } from "~/utils";
import { cameraVideoIcon, iconTray, taskbarMain } from "./sprites";
import TaskbarItem, { ITEM_WIDTH } from "./TaskbarItem";
import type Window from "./Window";

const ICON_SIZE = 25;
export const TASKBAR_HEIGHT = 40;

type Schema = {
  mainBar: ImageSource;
  startButton: ImageSource;
  iconTray: ImageSource;
  clock: GDIPlusTextSource;
  logo: ImageSource;
};

type Settings = {
  windows: Record<string, number>;
};

export class Taskbar extends Scene<Schema> {
  windows = observable<Window>([]);

  private itemMap = observable(new Map<Window, TaskbarItem>());

  constructor() {
    super({
      name: "Taskbar",
      items: {
        mainBar: {
          source: taskbarMain,
          positionX: 0,
          positionY: 1080,
          alignment: Alignment.BottomLeft,
        },
        startButton: {
          source: new ImageSource({
            name: "StartButton",
            settings: {
              file: asset`Taskbar/StartBarUp.png`,
            },
          }),
          positionX: 0,
          positionY: 1080,
          alignment: Alignment.BottomLeft,
        },
        iconTray: {
          source: iconTray,
          positionX: 1700,
          positionY: 1080,
          alignment: Alignment.BottomLeft,
        },
        clock: {
          source: new GDIPlusTextSource({
            name: "Clock",
            settings: {
              text: "",
              antialiasing: true,
              font: {
                face: "Trebuchet MS",
                flags: 1,
                size: 100,
                style: "Bold",
              },
            },
          }),
          positionX: 1910,
          positionY: 1072,
          alignment: Alignment.BottomRight,
          scaleX: 0.25,
          scaleY: 0.25,
        },
        logo: {
          source: cameraVideoIcon,
          positionX: 1803,
          positionY: 1072,
          alignment: Alignment.BottomLeft,
          scaleX: ICON_SIZE / 48,
          scaleY: ICON_SIZE / 48,
        },
      },
    });
  }

  async create(obs: OBS) {
    await super.create(obs);

    this.setPrivateSettings({
      windows: {},
    });

    reaction(
      () => toJS(this.windows),
      () => this.refreshWindows()
    );

    this.item("clock").source.setSettings({
      text: getTime(),
    });

    setInterval(() => {
      this.item("clock").source.setSettings({
        text: getTime(),
      });
    }, 1000);

    return this;
  }

  async refreshWindows() {
    const { windows } = await this.getPrivateSettings();

    await this.setPrivateSettings({
      windows: {
        ...windows,
        ...this.windows.reduce(
          (acc, window) => ({
            ...acc,
            [window.name]: this.item(`${window.name} Taskbar Item`)!.id,
          }),
          {}
        ),
      },
    });
  }

  @action
  async clear() {
    const windows = this.windows;

    await Promise.all(windows.map((window) => window.remove()));

    await this.setPrivateSettings({ windows: {} });

    this.windows.replace([]);
  }

  @action
  async addWindow(window: Window) {
    if (this.windows.find((w) => w.name === window.name)) return;
    const item = new TaskbarItem(window);
    this.itemMap.set(window, item);

    const startButtonTransform = this.item("startButton").transform;

    await this.createItem(`${window.name} Taskbar Item`, {
      source: item,
      alignment: Alignment.BottomLeft,
      positionX:
        startButtonTransform.width +
        this.windows.length * (ITEM_WIDTH + 2) /*change distance between*/ +
        3, // changes distance from start button
      positionY: 1080,
    });

    this.windows.push(window);
  }

  @action
  setFocus(window: Window, focused: boolean) {
    const item = this.itemMap.get(window);

    if (!item) return;

    return item.setFocused(focused);
  }

  @action
  async setNotify(window: Window, notify: boolean) {
    const item = this.itemMap.get(window);

    if (!item) return;

    return item.setNotify(notify);
  }

  @action
  async removeWindow(window: Window) {
    const item = this.itemMap.get(window);
    if (!item) return;

    await item.remove();

    this.itemMap.delete(window);

    this.windows.remove(window);
    this.updatePositions();
  }

  getWindowItem(window: Window) {
    return this.itemMap.get(window);
  }

  updatePositions() {
    const startButtonTransform = this.item("startButton").transform;

    const subjects: Record<string, any> = {};
    const keyframes: Record<string, any> = {};

    for (let [window, taskbarItem] of this.itemMap.entries()) {
      for (let ref in this.items) {
        if (ref !== taskbarItem.name) continue;

        const sceneItem = this.items[ref];

        subjects[ref] = sceneItem;

        const oldPosition = {
          x: sceneItem.transform.positionX,
          y: sceneItem.transform.positionY,
        };

        const newPos =
          startButtonTransform.width +
          this.windows.indexOf(window) *
            (ITEM_WIDTH + 3) /*change distance between*/ +
          5;

        if (oldPosition.x <= newPos) break;

        keyframes[ref] = {
          position: {
            x: {
              0: oldPosition.x,
              200: newPos,
            },
          },
        };
      }
    }

    animate({
      subjects,
      keyframes,
    });
  }
}
