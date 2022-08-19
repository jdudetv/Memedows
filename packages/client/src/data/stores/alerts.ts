import { observable } from "mobx";
import { initialize } from "~/data";
import { BaseStore } from "~/data/stores/base";
import { persist } from "~/decorators";
import chokidar from "chokidar";
import path from "path";
import { mainScene } from "~/obs/Main";

export interface AlertData {
  amount: number;
  exact: boolean;
  ScenePlayed: string;
  redemption?: string;
  bitVideo?: string;
  donoVideo?: string;
}

class AlertStore extends BaseStore {
  @observable
  @persist
  alerts = observable<AlertData>([]);

  @observable
  @persist
  videos = observable<String>([]);

  @observable
  @persist
  private alertRefs = new Map<number, true>();

  watcher!: chokidar.FSWatcher;

  initialize() {
    super.initialize.call(this);

    this.watcher = chokidar.watch(import.meta.env.VITE_ALERTS_VIDEO_DIRECTORY, {
      persistent: true,
      depth: 0,
    });

    this.watcher.on("add", (p) => this.handleAlertVidAdded(p));

    this.watcher = chokidar.watch(import.meta.env.VITE_ALERTS_VIDEO_DIRECTORY, {
      persistent: true,
      depth: 0,
    });

    this.watcher.on("unlink", (p) => this.handleAlertVidRemoved(p));

    return this;
  }

  async handleAlertVidAdded(filePath: string) {
    const name = path.basename(filePath, ".webm");
    //@ts-ignore

    if (this.videos.includes(name)) return;

    this.videos.push(name);
    console.log("Adding", name);

    this.sortAlertVideos();
  }

  sortAlertVideos() {
    this.videos = this.videos.sort((a, b) => {
      if (a.toUpperCase() < b.toUpperCase()) return -1;
      if (a.toUpperCase() < b.toUpperCase()) return 1;
      return 0;
    });
  }

  sortAmounts() {
    this.alerts = this.alerts.sort((a, b) => a.amount - b.amount);
  }

  async AddNewAlert(amount: number) {
    this.alerts.push({ amount: amount, exact: false, ScenePlayed: "Main" });
    this.sortAmounts();
  }

  async RemoveAlert(amount: number) {
    const index = this.alerts.findIndex((d) => d.amount === amount);

    if (index !== -1) this.alerts.splice(index, 1);
  }

  async handleAlertVidRemoved(filePath: string) {
    const name = path.basename(filePath, ".webm");

    const index = this.videos.findIndex((d) => d === name);

    if (index !== -1) this.videos.splice(index, 1);
  }
}

export const alertStore = new AlertStore().initialize();
