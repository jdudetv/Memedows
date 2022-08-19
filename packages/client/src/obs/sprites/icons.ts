import { ImageSource } from "@sceneify/sources";

import { asset } from "~/utils";

export const cameraVideoIcon = new ImageSource({
  name: "CameraVideoIcon",
  settings: {
    file: asset`Icons/camera-video.png`,
  },
});

export const gameIcon = new ImageSource({
  name: "GameIcon",
  settings: {
    file: asset`Icons/emblem-games.png`,
  },
});

export const musicIcon = new ImageSource({
  name: "MusicIcon",
  settings: {
    file: asset`Icons/emblem-music.png`,
  },
});

export const webIcon = new ImageSource({
  name: "WebIcon",
  settings: {
    file: asset`Icons/emblem-web.png`,
  },
});

export const pollIcon = new ImageSource({
  name: "PollIcon",
  settings: {
    file: asset`Icons/vboxgtk.png`,
  },
});

export const MineSweeperIcon = new ImageSource({
  name: "MineSweeperIcon",
  settings: {
    file: asset`Icons/gnome-gnomine.png`,
  },
});
