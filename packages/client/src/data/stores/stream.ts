import axios from "axios";
import { autorun, observable } from "mobx";
import { UserSubStatus } from "@memedows/types";

import { persist } from "~/decorators";
import { BaseStore } from "./base";
import { updateUsersXP } from "~/utils";
import { usersStore, eventsStore } from ".";
import { localDB } from "../jsondb";

const xpBase = 10;

const tiers = localDB.getData("/store/Tiers");

const kofiMulti: Record<number, number> = {
  1: 2,
  2: 4,
  3: 10,
  4: 20,
  5: 40,
  420: 150,
  1200: 420,
};

const subXpMultiplier: Record<UserSubStatus, number> = {
  0: 1,
  1: 2,
  2: 4,
  3: 10,
};

export class StreamStore extends BaseStore {
  @observable
  @persist
  live = true;

  initialize() {
    super.initialize.call(this);

    eventsStore.on("streamOnline", () => (this.live = true));
    eventsStore.on("streamOffline", () => (this.live = false));

    autorun(() => {
      if (this.live) this.startLoop();
      else this.stopLoop();
    });

    return this;
  }

  loopInterval: NodeJS.Timeout | null = null;

  startLoop() {
    this.loopInterval = setInterval(async () => {
      console.log("test");
      const res = await axios.get(
        "https://tmi.twitch.tv/group/user/jdudetv/chatters"
      );
      const { vips, moderators, staff, admins, global_mods, viewers } =
        res.data.chatters;

      const allViewers = new Set<string>([
        ...vips,
        ...moderators,
        ...staff,
        ...admins,
        ...global_mods,
        ...viewers,
        "jdudetv",
      ]);

      let xpUpdates: Record<string, number> = {};

      for (let viewer of allViewers) {
        let viewerData = usersStore.accounts.get(viewer);

        if (viewerData === undefined) continue;
        let Chatters = localDB.getData("/store/chatters/");
        let position = Chatters.indexOf(viewerData.displayName.toLowerCase());
        let multiplier = 1;
        if (position !== -1) {
          multiplier = 1 - position / 10 + 1;
        }
        let xpEarned = xpBase;
        console.log("being run");
        if (tiers[viewerData.displayName.toLowerCase()] !== undefined) {
          console.log("xp being given out");
          let tier: number = parseInt(
            tiers[viewerData.displayName.toLowerCase()].tier
          );
          xpEarned *=
            multiplier *
            (kofiMulti[tier] + subXpMultiplier[viewerData.subscription]);
        } else {
          xpEarned *= subXpMultiplier[viewerData.subscription] * multiplier;
        }
        xpUpdates[viewerData.id] = xpEarned;
      }
      console.log(xpUpdates);
      try {
        await updateUsersXP(xpUpdates);
      } catch (e) {
        console.log(e);
        console.log("failing");
      }
    }, 300000);
  }

  stopLoop() {
    if (this.loopInterval) clearInterval(this.loopInterval);
  }
}

export const streamStore = new StreamStore().initialize();
