import { OBS } from "@sceneify/core";

let Muted = 0;

export async function MuteMic(obs: OBS) {
  if (Muted === 0) {
    Muted++;
    obs.call("SetInputMute", { inputName: "Mic/Aux", inputMuted: true });
  } else {
    Muted++;
  }
}

export async function UnmuteMic(obs: OBS) {
  if (Muted === 1) {
    Muted--;
    obs.call("SetInputMute", { inputName: "Mic/Aux", inputMuted: false });
  } else {
    Muted--;
  }
}
