import { Alignment, OBS, Scene, SceneItem } from "@sceneify/core";
import { ImageSource, GDIPlusTextSource } from "@sceneify/sources";
import { taskbarDown, taskbarUp } from "./sprites";
import type Window from "./Window";

const ICON_SIZE = 25;

export const ITEM_WIDTH = 219;
export const ITEM_HEIGHT = 39;

type Schema = {
  icon: ImageSource;
  backgroundDown: ImageSource;
  backgroundUp: ImageSource;
  text: GDIPlusTextSource;
};

class TaskbarItem extends Scene<Schema> {
  setFocused(focused: boolean) {
    this.item("backgroundUp").setEnabled(!focused);
  }

  constructor(window: Window) {
    super({
      name: `${window.name} Taskbar Item`,
      items: {
        backgroundDown: {
          source: taskbarDown,
          positionX: 0,
          positionY: 1080,
          alignment: Alignment.BottomLeft,
        },
        backgroundUp: {
          source: taskbarUp,
          positionX: 0,
          positionY: 1080,
          alignment: Alignment.BottomLeft,
          enabled: false,
        },
        icon: {
          source: window.icon,
          positionX: 7,
          positionY: 1074,
          alignment: Alignment.BottomLeft,
        },
        text: {
          source: new GDIPlusTextSource({
            name: `${window.name} Label`,
            settings: {
              text: window.title,
              antialiasing: true,
              font: {
                face: "Trebuchet MS",
                flags: 1,
                size: 100,
                style: "Regular",
              },
            },
          }),
          positionX: 35,
          positionY: 1074,
          scaleX: 0.25,
          scaleY: 0.25,
          alignment: Alignment.BottomLeft,
        },
      },
    });
  }

  async create(obs: OBS) {
    await super.create(obs);

    let icon = this.item("icon");

    await icon.setTransform({
      scaleX: ICON_SIZE / icon.transform.sourceWidth,
      scaleY: ICON_SIZE / icon.transform.sourceHeight,
    });

    return this;
  }
}

export default TaskbarItem;
