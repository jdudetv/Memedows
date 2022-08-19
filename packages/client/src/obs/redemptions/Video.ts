import { Alignment, MonitoringType, Scene } from "@sceneify/core";
import { ColorSource, MediaSource } from "@sceneify/sources";
import { ChromaKeyFilter, CompressorFilter } from "@sceneify/filters";
import { v4 as uuidv4 } from "uuid";

import { videosStore } from "../../data/stores/videos";
import Window, { WindowItem } from "../Window";
import { getRandomInt } from "~/utils";
import { cameraVideoIcon } from "../sprites";
import { updateBoundsForItem } from "../physics";
import {
  registerMotionBlurItem,
  unregisterMotionBlurItem,
} from "../motionBlur";
import { mainScene, obs } from "../Main";

const directory = import.meta.env.VITE_VIDEOS_DIRECTORY;

export async function GenericVideo(
  name: string,
  parentScene: Scene,
  FileLocation: string,
  ShowATEnd = false,
  positionx = 960,
  positiony = 540,
  scale = 1,
  GS?: boolean
) {
  const uuid = uuidv4();
  const mediaSource = new MediaSource({
    name: `video${name}-${uuid}`,
    settings: {
      local_file: FileLocation,
      clear_on_media_end: !ShowATEnd,
    },
    filters: {
      limiter: new CompressorFilter({
        name: "AudioLimiter",
        settings: {
          ratio: 20,
          threshold: -30,
          output_gain: 5,
        },
      }),
    },
    audioMonitorType: MonitoringType.MonitorAndOutput,
  });

  let videosInMain = await parentScene.createItem(`video${name}-${uuid}`, {
    source: mediaSource,
    positionX: positionx,
    positionY: positiony,
    alignment: Alignment.Center,
    scaleX: scale,
    scaleY: scale,
  });

  if (GS === true) {
    videosInMain.source.addFilter(
      "CHROMAKEYFILTER",
      new ChromaKeyFilter({
        name: "ChromaKeyFrank",
        settings: {
          similarity: 400,
        },
      })
    );
  }

  if (ShowATEnd === true) return videosInMain;

  return new Promise((res: any) => {
    mediaSource.once("PlaybackEnded", async () => {
      await videosInMain.remove();
      res();
    });
  });
}

export async function createVideoWindow(parentScene: Scene, _name: string) {
  const name = _name.toUpperCase();

  const videoData = videosStore.videos.get(name);
  if (!videoData) return;
  const uuid = uuidv4();

  const source = new MediaSource({
    name: `video${name}-${uuid}`,
    settings: {
      local_file: `${directory}\\${name}.mp4`,
    },
    filters: {
      limiter: new CompressorFilter({
        name: "AudioLimiter",
        settings: {
          ratio: 20,
          threshold: -30,
          output_gain: 0,
        },
      }),
    },
    audioMonitorType: MonitoringType.MonitorAndOutput,
  });

  const videoScene = new Scene({
    name: `${name}-${uuid} Scene`,
    items: {
      background: {
        source: new ColorSource({
          name: `${name}-${uuid} Background`,
          settings: {
            color: 0xff000000,
            width: videoData.resolution.width,
            height: videoData.resolution.height,
          },
        }),
        positionX: 1920 / 2,
        positionY: 1080 / 2,
        alignment: Alignment.Center,
      },
      video: {
        source,
        positionX: 1920 / 2,
        positionY: 1080 / 2,
        alignment: Alignment.Center,
      },
    },
  });

  const videoWindowScene = new Window({
    title: name,
    name: `${name}-${uuid}`,
    contentScene: videoScene,
    boundsItem: "background",
    scale: Math.max(Math.random(), 0.3),
    icon: cameraVideoIcon,
  });

  const xPos = getRandomInt(
    videoData.resolution.width / 2,
    1920 - videoData.resolution.width / 2
  );

  const item = await parentScene.createItem(videoWindowScene.name, {
    source: videoWindowScene,
    positionX: xPos,
    positionY: -500,
    alignment: Alignment.Center,
  });

  updateBoundsForItem(item);
  // registerMotionBlurItem(item);

  source.once("PlaybackEnded", async () => {
    // unregisterMotionBlurItem(item);
    console.log("media removed", source.name);

    await (parentScene.item(videoWindowScene.name) as WindowItem<any>).delete();
    await videoWindowScene.delete();
  });
}
