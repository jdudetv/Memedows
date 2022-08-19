import chokidar from "chokidar";
import { observable } from "mobx";
import path from "path";
import { deleteField, doc, updateDoc } from "firebase/firestore";

import { persist } from "~/decorators";
import { BaseStore } from "./base";
import { getAudioFileLength } from "~/utils";
import { db } from "../services/firebase";

class SoundsStore extends BaseStore {
  @observable
  @persist
  sounds = observable<string>([]);

  watcher!: chokidar.FSWatcher;

  initialize() {
    super.initialize.call(this);

    const directory = import.meta.env.VITE_SOUNDS_DIRECTORY;
    if (directory === undefined)
      throw new Error("Sounds directory is undefined!");

    this.watcher = chokidar.watch(directory, {
      persistent: true,
      depth: 0,
    });

    this.watcher.on("add", (p) => this.handleSoundAdded(p));
    this.watcher.on("unlink", (p) => this.handleSoundRemoved(p));

    return this;
  }

  async handleSoundAdded(filePath: string) {
    console.log("adding sound");
    const fileName = path.basename(filePath, ".mp3");
    if (/([a-z])\w+/.test(fileName)) return;
    if (this.sounds.includes(fileName)) return;
    const duration = Math.round((await getAudioFileLength(filePath)) * 10) / 10;

    await updateDoc(doc(db, "public", "sounds"), {
      [fileName]: {
        redemptions: 0,
        duration,
      },
    });

    this.sounds.push(fileName);
  }

  async handleSoundRemoved(filePath: string) {
    const fileName = path.basename(filePath, ".mp3");

    await updateDoc(doc(db, "public", "sounds"), {
      [fileName]: deleteField(),
    });

    console.log("removing sound");
    this.sounds.remove(fileName);
  }
}

export const soundsStore = new SoundsStore().initialize();
