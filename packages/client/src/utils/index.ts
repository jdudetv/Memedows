import { doc, increment, writeBatch } from "firebase/firestore";
import { ipcRenderer } from "electron";
import path from "path";
import { promisify } from "util";
import imageSize from "image-size";

import ffmpeg from "../data/ffmpeg";
import { db, updateitproperly } from "~/data/services/firebase";

export const mainLog = (data: any) => ipcRenderer.send("log", data);

export const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

export function asset([asset]: TemplateStringsArray) {
  return path.resolve(`L:/streaming/assets`, asset);
}

export function assetString(asset: string) {
  return path.resolve(`L:/streaming/assets`, asset);
}

export const updateUsersXP = (data: Record<number, number>) => {
  const returned = updateitproperly(data);
  return returned;
};

export const getAudioFileLength = (filePath: string) =>
  new Promise<number>((res, rej) =>
    ffmpeg.ffprobe(filePath, (e, data) => {
      if (e !== null) rej(e);
      else res(data.format.duration!);
    })
  );

export const getVideoResolution = (filePath: string) =>
  new Promise<{ width: number; height: number }>((res, rej) =>
    ffmpeg.ffprobe(filePath, (e, data) => {
      if (e !== null) rej(e);
      const videoStream = data.streams.find((s) => s.codec_type === "video");

      res({
        width: videoStream!.coded_width!,
        height: videoStream!.coded_height!,
      });
    })
  );

export const generateThumbnail = async (filePath: string) => {
  const fileName = path.basename(filePath, ".mp4");

  const data = (await promisify(ffmpeg.ffprobe)(
    filePath
  )) as ffmpeg.FfprobeData;

  const middleTime = Math.floor(data.format.duration! / 2);

  const thumbnailPath = path.resolve(filePath, `../thumbnails/${fileName}.jpg`);

  await new Promise((res) =>
    ffmpeg(filePath)
      .inputOptions([`-ss ${middleTime}`])
      .outputOptions(["-vframes 1", "-q:v 2"])
      .output(thumbnailPath)
      .on("end", res)
      .run()
  );

  return thumbnailPath;
};

export const sizeOf = promisify(imageSize);

export const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
};

export function getTime() {
  return new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "numeric",
  });
}
