import chokidar from "chokidar";
import fs from "fs";
import { mainScene, MusicWindow } from "~/obs/Main";
import { TMIClient } from "../services/emotes";

let timer = 0;

let musicWatcher = chokidar.watch("L:/Streaming/assets/music", {
  persistent: true,
  depth: 0,
});

setInterval(() => {
  if (timer > 0) timer--;
}, 1000);

musicWatcher.on("change", async (p) => {
  if (p.includes("song.txt")) {
    let file = fs.readFileSync(p, "utf-8");
    if (file !== "") CurrSong(true);
  }
});

export function CurrSong(OR: boolean) {
  if (timer == 0 || OR == true) {
    timer = 15;
    if (mainScene.item("MusicWindow").minimised) {
      mainScene.item("MusicWindow").toggleMinimised();
      setTimeout(() => {
        mainScene.item("MusicWindow").toggleMinimised();
      }, 10000);
    }
  }
}
