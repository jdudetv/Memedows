import { createContext, createRoot } from "solid-js";
import { createStore } from "solid-js/store";

export interface Bounds {
  x: any;
  y: any;
  width: any;
  height: any;
}

export interface Window {
  name: string;
  bounds: Bounds;
}

const VIEWPORT_WIDTH = window.innerWidth,
  VIEWPORT_HEIGHT = window.innerHeight - 40;

const WINDOW_PADDING = VIEWPORT_HEIGHT * 0.02;
const PLAYER_HEIGHT = (VIEWPORT_HEIGHT * 2) / 3;
const PLAYER_WIDTH = (PLAYER_HEIGHT * 16) / 9;
const PLAYER_X = (VIEWPORT_WIDTH - PLAYER_WIDTH) / 2;
const PLAYER_Y = WINDOW_PADDING;

export const DEFAULT_WINDOW_BOUNDS = {
  Chat: {
    x: PLAYER_X + PLAYER_WIDTH + WINDOW_PADDING,
    y: PLAYER_Y,
    width: VIEWPORT_WIDTH - (PLAYER_X + PLAYER_WIDTH + 2 * WINDOW_PADDING),
    height: VIEWPORT_HEIGHT - 2 * WINDOW_PADDING,
  },
  Stream: {
    x: PLAYER_X,
    y: PLAYER_Y,
    width: PLAYER_WIDTH,
    height: PLAYER_HEIGHT + 30,
  },
  CommandsChat: {
    x: WINDOW_PADDING,
    y: WINDOW_PADDING,
    width: VIEWPORT_WIDTH - (PLAYER_X + PLAYER_WIDTH + 2 * WINDOW_PADDING),
    height: VIEWPORT_HEIGHT / 2 - WINDOW_PADDING,
  },
  Media: {
    x: PLAYER_X,
    y: PLAYER_Y + PLAYER_HEIGHT + 2 * WINDOW_PADDING,
    width: PLAYER_WIDTH,
    height: VIEWPORT_HEIGHT - (PLAYER_HEIGHT + 4 * WINDOW_PADDING),
  },
  Info: {
    x: WINDOW_PADDING,
    y: VIEWPORT_HEIGHT / 2 + WINDOW_PADDING,
    width: VIEWPORT_WIDTH - (PLAYER_X + PLAYER_WIDTH + 2 * WINDOW_PADDING),
    height: VIEWPORT_HEIGHT / 2 - 2 * WINDOW_PADDING,
  },
};

export function bringToFront(name: string) {
  setter((d) => {
    const targetIndex = d.findIndex((w) => w.name === name);

    if (targetIndex == d.length - 1) return d;

    const start = d.slice(0, targetIndex);
    const end = d.slice(targetIndex + 1);

    const arr = [...start, ...end, d[targetIndex]];

    return arr;
  });
}

export function registerWindow(name: keyof typeof DEFAULT_WINDOW_BOUNDS) {
  setter((d) => {
    const localBounds = JSON.parse(localStorage.getItem(name) ?? "null");

    let bounds;
    if (localBounds) bounds = localBounds;
    else if (DEFAULT_WINDOW_BOUNDS[name]) {
      bounds = DEFAULT_WINDOW_BOUNDS[name];
    }

    return [...d, { name, bounds }];
  });
}

export function updateBounds(name: string, bounds: Partial<Bounds>) {
  setter(
    (window) => window.name === name,
    "bounds",
    (b) => ({ ...b, ...bounds })
  );
}

export function createWindow(name: keyof typeof DEFAULT_WINDOW_BOUNDS) {
  registerWindow(name);

  return data.find((w) => w.name === name)!;
}

export function resetLayout() {
  let window: keyof typeof DEFAULT_WINDOW_BOUNDS;
  for (window in DEFAULT_WINDOW_BOUNDS) {
    localStorage.removeItem(window);

    updateBounds(window, DEFAULT_WINDOW_BOUNDS[window]);
  }
}

const [data, setter] = createRoot(() => createStore([] as Window[]));

export const windowStore = data;
