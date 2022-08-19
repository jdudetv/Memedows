import {
  SceneItemTransform,
  Scene,
  Alignment,
  SceneItem,
  SourceFilters,
  Source,
  OBS,
} from "@sceneify/core";
import { ImageSource, GDIPlusTextSource } from "@sceneify/sources";
import { Easing, keyframe, animate, wait } from "@sceneify/animation";

import { registerPhysicsItem, unregisterPhysicsItem } from "./physics";
import {
  windowBottom,
  windowLeft,
  windowRight,
  windowTop,
  windowBottomLeft,
  windowBottomRight,
  windowTopLeft,
  windowTopRight,
  windowTopRightCutout,
} from "./sprites";
import { taskbar } from "./Main";

const BORDER_WIDTH = 4;
const HEADER_HEIGHT = 27;

const ICON_SIZE = 25;
const PADDING = 6;

export class WindowItem<W extends Window> extends SceneItem<W> {
  private lastPosition?: { x: number; y: number };
  private lastScale?: number;
  minimised: boolean = false;

  async setTransform({
    scaleX,
    scaleY,
    ...transform
  }: DeepPartial<SceneItemTransform>) {
    this.transform.scaleX = scaleX ?? this.transform.scaleX;
    this.transform.scaleY = scaleY ?? this.transform.scaleY;

    if (scaleX != undefined || scaleY != undefined)
      await this.source.setScale({
        x: this.transform.scaleX,
        y: this.transform.scaleY,
      });

    await super.setTransform(transform);
  }

  constructor(
    source: W,
    scene: Scene,
    id: number,
    ref: string,
    physics: boolean
  ) {
    super(source, scene, id, ref);
    if (physics === true) {
      this.registerPhysics();
    }
  }

  registerPhysics() {
    let WIDTH = this.source.borders ? BORDER_WIDTH : 0;
    let HEIGHT = this.source.borders ? HEADER_HEIGHT : 0;
    if (this.minimised) return;
    registerPhysicsItem(this, {
      getBounds: () => {
        return {
          width:
            this.source.contentTransform.width *
              this.source.item("content").transform.scaleX +
            2 * WIDTH,
          height:
            this.source.contentTransform.height *
              this.source.item("content").transform.scaleY +
            WIDTH +
            HEIGHT,
          offset: {
            x: 0,
            y: (HEIGHT - WIDTH) / 2,
          },
        };
      },
    });
  }

  async toggleMinimised() {
    if (this.minimised) {
      animate({
        subjects: {
          a: this as SceneItem,
        },
        keyframes: {
          a: {
            positionX: { 500: keyframe(this.lastPosition!.x, Easing.Out) },
            positionY: { 500: keyframe(this.lastPosition!.y, Easing.Out) },
            scaleX: { 500: keyframe(this.lastScale!, Easing.Out) },
            scaleY: { 500: keyframe(this.lastScale!, Easing.Out) },
          },
        },
      });

      await wait(500);
      if (this.source.physics === true) {
        let WIDTH = this.source.borders ? BORDER_WIDTH : 0;
        let HEIGHT = this.source.borders ? HEADER_HEIGHT : 0;
        registerPhysicsItem(this, {
          getBounds: () => {
            return {
              width:
                this.source.contentTransform.width *
                  this.source.item("content").transform.scaleX +
                2 * WIDTH,
              height:
                this.source.contentTransform.height *
                  this.source.item("content").transform.scaleY +
                WIDTH +
                HEIGHT,
              offset: {
                x: 0,
                y: (HEIGHT - WIDTH) / 2,
              },
            };
          },
        });
      }
    } else {
      unregisterPhysicsItem(this);

      this.lastPosition = {
        x: this.transform.positionX,
        y: this.transform.positionY,
      };
      console.log(this);
      this.lastScale = this.source.initialScale;

      const taskbarTransform = taskbar.item(
        this.source.name + " Taskbar Item"
      )!.transform;

      animate({
        subjects: {
          thething: this as SceneItem,
        },
        keyframes: {
          thething: {
            positionX: {
              500: keyframe(taskbarTransform.positionX + 110, Easing.In),
            },
            positionY: {
              500: keyframe(taskbarTransform.positionY + 50, Easing.In),
            },
            scaleX: { 500: keyframe(0.1, Easing.In) },
            scaleY: { 500: keyframe(0.1, Easing.In) },
          },
        },
      });
    }

    taskbar.setFocus(this.source, this.minimised);
    this.minimised = !this.minimised;
  }

  delete() {
    unregisterPhysicsItem(this);
    return super.remove();
  }
}

type WindowSceneItems<ContentScene extends Scene> = {
  content: ContentScene;
  bottom?: ImageSource;
  left?: ImageSource;
  right?: ImageSource;
  top?: ImageSource;
  bottomLeft?: ImageSource;
  bottomRight?: ImageSource;
  topRight?: Scene;
  topLeft?: Scene<{
    background?: ImageSource;
    icon?: ImageSource;
    text?: GDIPlusTextSource;
  }>;
};

let topRight = new Scene({
  name: `Window Top Right`,
  items: {
    buttons: {
      source: windowTopRight,
      positionX: 1920,
      alignment: Alignment.TopRight,
    },
    cutout: {
      source: windowTopRightCutout,
      positionX: 1920,
      alignment: Alignment.TopRight,
    },
  },
});

interface Args<TContentScene extends Scene, Filters extends SourceFilters> {
  name: string;
  title?: string;
  contentScene: TContentScene;
  boundsItem: TContentScene extends Scene<infer I> ? keyof I : never;
  scale: number;
  icon: ImageSource;
  physics?: boolean;
  borders?: boolean;
  filters?: Filters;
}

class Window<
  TContentScene extends Scene = any,
  Filters extends SourceFilters = SourceFilters
> extends Scene<WindowSceneItems<TContentScene>, Filters> {
  private boundsItem: string;
  public initialScale: number;
  public physics: boolean;
  public borders: boolean;

  icon: ImageSource;
  title: string;

  createSceneItemObject(
    scene: Scene,
    id: number,
    ref: string
  ): WindowItem<this> {
    return new WindowItem(this, scene, id, ref, this.physics);
  }

  constructor({
    name,
    contentScene,
    boundsItem,
    scale,
    icon,
    title,
    filters,
    physics,
    borders,
  }: Args<TContentScene, Filters>) {
    const border = borders == null ? true : false;
    super({
      name: `${name} Window`,
      items: border
        ? {
            content: {
              source: contentScene,
            },
            bottom: {
              source: windowBottom,
            },
            left: {
              source: windowLeft,
            },
            right: {
              source: windowRight,
            },
            top: {
              source: windowTop,
            },
            bottomLeft: {
              source: windowBottomLeft,
            },
            bottomRight: {
              source: windowBottomRight,
            },
            topRight: {
              source: topRight,
            },
            topLeft: {
              source: new Scene({
                name: `${name} Top Left`,
                items: {
                  background: {
                    source: windowTopLeft,
                    alignment: Alignment.TopLeft,
                    positionX: 0,
                    positionY: 0,
                  },
                  icon: {
                    source: icon,
                    alignment: Alignment.TopLeft,
                    positionX: BORDER_WIDTH + PADDING + 2,
                    positionY: 2,
                  },
                  text: {
                    source: new GDIPlusTextSource({
                      name: `${name} Top Left Text`,
                      settings: {
                        text: title || name,
                        antialiasing: true,
                        font: {
                          face: "Trebuchet MS",
                          flags: 1,
                          size: 100,
                          style: "Regular",
                        },
                      },
                    }),
                    alignment: Alignment.TopLeft,
                    positionX: BORDER_WIDTH + ICON_SIZE + 2 * PADDING,
                    positionY: 2,
                    scaleX: 0.25,
                    scaleY: 0.25,
                  },
                },
              }),
            },
          }
        : {
            content: {
              source: contentScene,
            },
          },
      filters,
    });

    this.boundsItem = boundsItem as string;
    this.initialScale = scale;
    this.title = title || name;
    this.icon = icon;
    this.physics = physics == null ? true : false;
    this.borders = borders == null ? true : false;
  }

  async create(obs: OBS) {
    await super.create(obs);
    if (this.borders) {
      let icon = this.item("topLeft").source.item("icon");
      await icon.setTransform({
        scaleX: ICON_SIZE / icon.transform.sourceWidth,
        scaleY: ICON_SIZE / icon.transform.sourceHeight,
      });
    }

    await Promise.all([
      this.setScale({
        x: this.initialScale,
        y: this.initialScale,
      }),
      taskbar?.addWindow(this),
    ]);

    return this;
  }

  get contentTransform() {
    return this.item("content").source.item(this.boundsItem)!.transform;
  }

  async setScale(scale: { x?: number; y?: number }) {
    const transforms = calculateWindowItemTransforms(
      this.contentTransform,
      scale,
      this.borders
    );

    await Promise.all(
      Object.entries(transforms).map(([key, transforms]) =>
        this.item(key)!.setTransform(transforms)
      )
    );
  }

  async delete() {
    if (this.borders) await this.item("topLeft").source.remove();
    await this.item("content").source.remove();
    taskbar.removeWindow(this);
    await super.remove();
  }
}

function calculateWindowItemTransforms(
  contentSize: { width: number; height: number },
  scale: { x?: number; y?: number },
  borders: boolean
): Record<string, Partial<SceneItemTransform>> {
  const contentWidth = scale.x ? contentSize.width * scale.x : undefined;
  const contentHeight = scale.y ? contentSize.height * scale.y : undefined;
  const content = {
    positionX: 1920 / 2,
    positionY: 1080 / 2,
    alignment: Alignment.Center,
    scaleX: scale.x,
    scaleY: scale.y,
  };

  return borders
    ? {
        content,
        bottom: {
          positionX: 1920 / 2,
          positionY: Math.min((1080 + contentHeight!) / 2 + BORDER_WIDTH, 1080),
          alignment: Alignment.BottomCenter,
          scaleX: contentWidth ? contentWidth * 0.97 : undefined,
        },
        left: {
          positionX: Math.max((1920 - contentWidth!) / 2 - BORDER_WIDTH, 0),
          positionY: 1080 / 2 - 24,
          alignment: Alignment.CenterLeft,
          scaleY: contentHeight ? contentHeight * 0.97 : undefined,
        },
        right: {
          positionX: Math.min((1920 + contentWidth!) / 2 + BORDER_WIDTH, 1920),
          positionY: 1080 / 2 - 24,
          alignment: Alignment.CenterRight,
          scaleY: contentHeight ? contentHeight * 0.97 : undefined,
        },
        top: {
          positionX: 1920 / 2,
          positionY: Math.max((1080 - contentHeight!) / 2 - HEADER_HEIGHT, 0),
          alignment: Alignment.TopCenter,
          scaleX: contentWidth ? contentWidth * 0.97 : undefined,
        },
        bottomLeft: {
          alignment: Alignment.BottomLeft,
          positionX: Math.max((1920 - contentWidth!) / 2 - BORDER_WIDTH, 0),
          positionY: Math.min((1080 + contentHeight!) / 2 + BORDER_WIDTH, 1080),
        },
        bottomRight: {
          alignment: Alignment.BottomRight,
          positionX: Math.min((1920 + contentWidth!) / 2 + BORDER_WIDTH, 1920),
          positionY: Math.min((1080 + contentHeight!) / 2 + BORDER_WIDTH, 1080),
        },
        topRight: {
          alignment: Alignment.TopRight,
          positionX: Math.min((1920 + contentWidth!) / 2 + BORDER_WIDTH, 1920),
          positionY: Math.max((1080 - contentHeight!) / 2 - HEADER_HEIGHT, 0),
        },
        topLeft: {
          alignment: Alignment.TopLeft,
          positionX: Math.max((1920 - contentWidth!) / 2 - BORDER_WIDTH, 0),
          positionY: Math.max((1080 - contentHeight!) / 2 - HEADER_HEIGHT, 0),
        },
      }
    : {
        content,
      };
}

export default Window;
