import { v4 as uuidv4 } from "uuid";
import { CompressorFilter, ChromaKeyFilter } from "@sceneify/filters";
import { MediaSource } from "@sceneify/sources";

import { mainScene, obs } from "~/obs/Main";
import { MonitoringType } from "@sceneify/core";

const FFVideo = [
  "FF1",
  "FF2",
  "FF3",
  "FF4",
  "FF5",
  "FF6",
  "FF7",
  "FF8",
  "FF9",
  "FF10",
  "FF11",
  "FF12",
  "FF13",
  "FF14",
  "FF15",
  "FF16",
  "FF17",
  "FF18",
  "FF69",
  "FF420",
];

export async function FilthyFrank() {
  let videoName = FFVideo[Math.floor(Math.random() * FFVideo.length)];
  if (videoName === "FF69" || videoName === "FF420") {
    // Random
    if (Math.floor(Math.random() * 100) !== 0) {
      videoName = FFVideo[Math.floor(Math.random() * FFVideo.length - 2)];
    } else {
      console.log("ULTRA RARE FRANK PLAYING");
    }
  }
  const FFName = "FF" + uuidv4();

  const FFSSource = await mainScene.createItem(FFName, {
    source: new MediaSource({
      name: FFName,
      settings: {
        local_file: `L:\\Streaming\\FF\\${videoName}.mp4`,
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
        chrokmaKey: new ChromaKeyFilter({
          name: "ChromaKeyFrank",
          settings: {},
        }),
      },
      audioMonitorType: MonitoringType.MonitorAndOutput,
    }),
  });

  FFSSource.source.once("PlaybackEnded", () => {
    FFSSource.remove();
  });
}
