import { createRedemptionHandler, redemptionEnded } from "./base";
import { asset, wait } from "~/utils";
import { TMIClient } from "~/data/services/emotes";
import { GenericVideo } from "~/obs/redemptions";
import { mainScene, obs } from "~/obs/Main";
import { MuteMic, UnmuteMic } from "~/obs/MuteMic";

export let TTSingChat = 0;

createRedemptionHandler({
  event: "d/c",
  handler: async (data) => {
    MuteMic(obs);
    await GenericVideo("Disconnect", mainScene, asset`videos/dc.mp4`, false);
    UnmuteMic(obs);
    redemptionEnded("d/c");
  },
});
