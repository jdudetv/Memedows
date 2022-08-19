import { createRedemptionHandler, redemptionEnded } from "./base";
import { createVideoWindow, TTSFunction } from "~/obs/redemptions";
import { mainScene } from "~/obs/Main";
import { videosStore } from "~/data/stores/videos";
import { wait } from "~/utils";
import { TMIClient } from "~/data/services/emotes";

export let TTSingChat = 0;

createRedemptionHandler({
  event: "ttschat",
  handler: async (data) => {
    TMIClient.say(
      "jdudetv",
      "/me " +
        data.userName +
        " Has turned on TTS MODE. ALL chat messages will now TTS for 30s"
    );
    TMIClient.slow("jdudetv", 5);
    TTSingChat = 1;
    await wait(30000);
    TTSingChat = 0;
    TMIClient.slowoff("jdudetv");
    TMIClient.say("jdudetv", "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    ~TMIClient.say("jdudetv", "~~~~~~~~~~~~~~~~TTS IS OVER~~~~~~~~~~~~~~~~");
    TMIClient.say("jdudetv", "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    redemptionEnded("ttschat");
  },
});
