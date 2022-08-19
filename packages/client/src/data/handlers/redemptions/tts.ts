import { TTSFunction } from "~/obs/redemptions/TTS";
import { createRedemptionHandler, redemptionEnded } from "./base";

createRedemptionHandler({
  event: "tts",
  handler: async (data) => {
    redemptionEnded("tts");
    TTSFunction(data.input);
  },
});
