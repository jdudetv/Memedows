import { createRedemptionHandler, redemptionEnded } from "./base";
import { mainScene } from "~/obs/Main";
import axios from "axios";
import { Alignment, MonitoringType } from "@sceneify/core";
import { ChromaKeyFilter, CompressorFilter } from "@sceneify/filters";
import { MediaSource } from "@sceneify/sources";
import { asset, wait } from "~/utils";
import { TMIClient } from "~/data/services/emotes";
import { TTSFunction } from "~/obs/redemptions";

createRedemptionHandler({
  event: "thanossnap",
  handler: async (data) => {
    console.log("thanos");
    const res = await axios.get(
      "https://tmi.twitch.tv/group/user/jdudetv/chatters"
    );
    const { vips, moderators, staff, admins, global_mods, viewers } =
      res.data.chatters;

    console.log(viewers.length);
    let loop = viewers.length / 2;

    const SNAPSOURCE = await mainScene.createItem("SNAP", {
      source: new MediaSource({
        name: "SNAP",
        settings: {
          local_file: asset`SNAP/head.mov`,
        },
        filters: {
          limiter: new CompressorFilter({
            name: "AudioLimiter",
            settings: {
              ratio: 20,
              threshold: -30,
              output_gain: 5,
            },
          }),
        },
      }),
      positionX: 960,
      positionY: 540,
      scaleX: 1,
      scaleY: 1,
      alignment: Alignment.Center,
    });

    SNAPSOURCE.source.setAudioMonitorType(MonitoringType.MonitorAndOutput);

    await wait(6000);

    for (let i = 0; i < loop; i++) {
      let UserPos = Math.round(Math.random() * viewers.length);
      TTSFunction(viewers[UserPos]);
      await wait(100);
      TMIClient.timeout("jdudetv", viewers[UserPos], 5, "THANOS SNAP");
      viewers.splice(UserPos, 1);
    }

    await wait(14000);

    await SNAPSOURCE.remove();

    redemptionEnded("thanossnap");
  },
});
