import { createRoot } from "solid-js";
import { createStore } from "solid-js/store";

const [data, setter] = createRoot(() =>
  createStore({
    coverWindow: false,
    startMenuVisible: false,
  })
);

export const uiStore = data;

export function toggleCoverWindow(value?: boolean) {
  setter((d) => ({ ...d, coverWindow: value ?? !d.coverWindow }));
}

export function toggleStartMenuVisible(value?: boolean) {
  setter((d) => ({ ...d, startMenuVisible: value ?? !d.startMenuVisible }));
}
