import chokidar from "chokidar";
import { observable } from "mobx";
import path from "path";
import fs from "fs";
import { promisify } from "util";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { deleteField, doc, updateDoc } from "firebase/firestore";

import { persist } from "~/decorators";
import { BaseStore } from "./base";
import {
  generateThumbnail,
  getAudioFileLength,
  getVideoResolution,
} from "~/utils";
import { db, storage } from "../services/firebase";
import ffmpeg from "../ffmpeg";

class VideosStore extends BaseStore {
  @observable
  @persist
  videos = observable<string>(
    new Map<string, { resolution: { width: number; height: number } }>()
  );

  ingestWatcher!: chokidar.FSWatcher;
  deleteWatcher!: chokidar.FSWatcher;

  initialize() {
    super.initialize.call(this);

    this.ingestWatcher = chokidar.watch(
      import.meta.env.VITE_VIDEOS_INGEST_DIRECTORY,
      {
        persistent: true,
        depth: 0,
      }
    );

    this.ingestWatcher.on("add", (p) => this.handleVideoAdded(p));

    this.deleteWatcher = chokidar.watch(import.meta.env.VITE_VIDEOS_DIRECTORY, {
      persistent: true,
      depth: 0,
    });

    this.deleteWatcher.on("unlink", (p) => this.handleVideoRemoved(p));

    return this;
  }

  async handleVideoAdded(filePath: string) {
    const fileName = path.basename(filePath, ".mp4");

    if (this.videos.has(fileName)) return;

    const duration = Math.round((await getAudioFileLength(filePath)) * 10) / 10;

    const ingestFilePath = path.join(
      import.meta.env.VITE_VIDEOS_INGEST_DIRECTORY,
      `${fileName}.mp4`
    );

    const resizedFilePath = path.join(
      import.meta.env.VITE_VIDEOS_DIRECTORY,
      `${fileName}.mp4`
    );

    const resolution = await getVideoResolution(ingestFilePath);

    await new Promise<void>(async (res) => {
      let command = ffmpeg({ source: filePath });

      if (resolution.width > 480 || resolution.height > 480)
        command = command.withSize(resolution.width > 480 ? "480x?" : "?x480");

      command.on("end", () => res()).saveToFile(resizedFilePath);
    });

    await promisify(fs.unlink)(filePath);

    const thumbnail = await generateThumbnail(resizedFilePath);

    const uploadRef = ref(storage, `video_thumbnails/${fileName}.jpg`);

    await uploadBytes(uploadRef, fs.readFileSync(thumbnail), {
      cacheControl: "max-age=604800",
    });

    const thumbnailURL = await getDownloadURL(uploadRef);

    await updateDoc(doc(db, "public", "videos"), {
      [fileName]: {
        redemptions: 0,
        duration,
        thumbnailURL,
      },
    });

    const resolutionAfter = await getVideoResolution(resizedFilePath);

    this.videos.set(fileName, { resolution: resolutionAfter });
  }

  async handleVideoRemoved(filePath: string) {
    const fileName = path.basename(filePath, ".mp4");

    await deleteObject(ref(storage, `video_thumbnails/${fileName}.jpg`));
    await updateDoc(doc(db, "public", "videos"), {
      [fileName]: deleteField(),
    });

    this.videos.delete(fileName);
  }
}

export const videosStore = new VideosStore().initialize();
