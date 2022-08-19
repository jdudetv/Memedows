import chokidar from "chokidar";
import { asset, sizeOf } from "~/utils";
import { ImageSource, Scene } from "@sceneify/core";
import { Stats } from "fs";
import { mainScene } from "../Main";

export class WallpaperListener {
  watcher!: chokidar.FSWatcher;
  source: any;

  initialize(scene: any) {
    this.source = scene.items.Wallpaper;
    const wallpaper = asset`images/wallpaper.png`;
    if (wallpaper === undefined)
      throw new Error("Wallpaper file is undefined!");

    this.watcher = chokidar.watch(wallpaper, {
      persistent: true,
      depth: 0,
    });

    this.watcher.on("change", (p, stats) => this.handleWallpaperChanged(p));
    return this;
  }

  async handleWallpaperChanged(p: any): Promise<void> {
    console.log(`Path ${p} changed`);
    const imageSize = (await sizeOf(asset`images/wallpaper.png`))!;
    console.log(imageSize);
    mainScene.items.wallpaper.setProperties({
      scale: {
        x: 1920 / imageSize.width!,
        y: 1080 / imageSize.height!,
      },
    });
  }
}
