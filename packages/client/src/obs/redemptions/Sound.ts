import { MonitoringType } from "@sceneify/core";
import { CompressorFilter } from "@sceneify/filters";
import { MediaSource } from "@sceneify/sources";
import { v4 as uuidv4 } from "uuid";
import { wait } from "~/utils";
import { mainScene, obs } from "../Main";

const directory = import.meta.env.VITE_SOUNDS_DIRECTORY;

export async function createSound(_name: string) {
  const name = _name.toUpperCase();
  GenericSound(_name, `${directory}\\${name}.mp3`, 30, true, 0);
}

export async function GenericSound(
  _name: string,
  filePath: string,
  volume = -30,
  useFilter = true,
  Gain = 0
): Promise<void> {
  return new Promise(async function (res) {
    const name = _name.toUpperCase();
    const uuid = uuidv4();
    const sourceName = `${name}-${uuid}`;
    const SourceThing = await mainScene.createItem(sourceName, {
      source: new MediaSource({
        name: sourceName,
        settings: {
          local_file: filePath,
        },
        filters: {
          AudioLimit: new CompressorFilter({
            name: "AudioLimiter",
            settings: {
              ratio: 20,
              threshold: Math.abs(volume) * -1,
              output_gain: Gain,
            },
          }),
        },
        audioMonitorType: MonitoringType.MonitorAndOutput,
      }),
      positionX: 9999,
      positionY: 9999,
    });

    SourceThing.source.once("PlaybackEnded", async () => {
      await wait(1000);
      await SourceThing.remove();
      res();
    });
  });
}
