import { WindowStore } from "./WindowStore";
import { UIStore } from "./UIStore";

export class RootStore {
  windows = new WindowStore();
  ui = new UIStore();
}

export const store = new RootStore();
