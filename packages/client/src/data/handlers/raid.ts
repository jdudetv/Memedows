import { RaidPayload } from "@memedows/types/lib/twitch/events";
import { Alignment, MonitoringType, SceneItem } from "@sceneify/core";
import {
  ColorSource,
  GDIPlusTextSource,
  ImageSource,
  MediaSource,
} from "@sceneify/sources";
import {
  ChromaKeyFilter,
  ColorCorrectionFilter,
  CompressorFilter,
} from "@sceneify/filters";
import { animate } from "@sceneify/animation";
import { mainScene, MainWrapper } from "~/obs/Main";
import { GenericSound, GenericVideo } from "~/obs/redemptions";
import { asset, assetString, getRandomInt, wait } from "~/utils";
import { RaidTog } from "../services/chat";
import { TMIClient } from "../services/emotes";
import { redemptionsStore, usersStore } from "../stores";
import { createHandler } from "./base";
import imageSize from "image-size";
import {
  getBody,
  registerPhysicsCircle,
  registerPhysicsItem,
  unregisterPhysicsItem,
} from "~/obs/physics";
import { v4 } from "uuid";
import { off } from "process";
import { BloomShader, SDFEffects } from "~/obs/filters";
import { EventFeed } from "./eventFeed";

export const Raid = createHandler({
  event: "raid",
  handler: async (data) => {
    EventFeed("Raid", data.fromName, data);
    console.log(data);
    raidFunc(data);
  },
});

let EvilClippy: SceneItem;
let raidHealth = 0;
let ClippyDead = 0;
let HealthBarFront: any;
let HealthBarBack: any;
let Fullhealth = 0;
let healthbarwidth = 700;
let healthText: any;
let ClippySpeech: SceneItem;

let EvilClippySource = new ImageSource({
  name: "EvilClippy",
  settings: {
    file: asset`images/EVILCLIPPY.png`,
  },
  filters: {
    OOF: new ColorCorrectionFilter({
      name: "OOF",
      settings: {
        color_multiply: 0x7373ff,
      },
    }),
  },
});

export async function raidFunc(data: RaidPayload) {
  if (data.viewers < 10) return;
  redemptionsStore.toggleRedemptions(
    [...redemptionsStore.redemptions.values()].map((r) => r.title),
    true,
    false
  );
  setTimeout(() => {
    RaidTog(1);
    TMIClient.say(
      "jdudetv",
      "Type BOP in chat to shoot clippy!!!! YOU HAVE 2 MINUTES!!!!!!!!!!!!!!!"
    );
  }, 15000);
  setTimeout(() => {
    TMIClient.say(
      "jdudetv",
      "Type BOP in chat to Shoot clippy!!!! YOU HAVE 2 MINUTES!!!!!!!!!!!!!!!"
    );
  }, 20000);
  GenericVideo(
    "MSExplosion",
    MainWrapper,
    asset`Mine/Explode.mp4`,
    false,
    MainWrapper.item("EvilClippy")?.transform.positionX,
    MainWrapper.item("EvilClippy")?.transform.positionY,
    1.4,
    true
  );
  ClippyDead = 0;
  raidHealth = Math.floor(200 * Math.pow(data.viewers, 0.33) + 100);
  Fullhealth = raidHealth;
  HealthBarFront = await MainWrapper.createItem("HealthBarFront", {
    source: new ColorSource({
      name: "HealthBarFront",
      settings: {
        color: 0xff0000ff,
        width: healthbarwidth,
        height: 50,
      },
    }),
    positionX: 960,
    positionY: 50,
    alignment: Alignment.Center,
  });
  healthText = await MainWrapper.createItem("RaidHealthText", {
    source: new GDIPlusTextSource({
      name: "HealthText",
      settings: {
        text: Fullhealth.toString(),
        font: {
          face: "Comic Sans MS",
          size: 40,
        },
        align: "left",
        color: 0xff000000,
      } as any,
    }),
    positionX: 960,
    positionY: 50,
    alignment: Alignment.Center,
  });
  EvilClippy = await MainWrapper.createItem("EvilClippy", {
    source: EvilClippySource,
    positionX: 970,
    positionY: 540,
    scaleX: 0.5,
    scaleY: 0.5,
    rotation: 0,
    alignment: Alignment.Center,
  });

  ClippySpeech = await MainWrapper.createItem("ClippySpeech", {
    source: new MediaSource({
      name: "ClippySpeech",
      audioMonitorType: MonitoringType.MonitorAndOutput,
      settings: {
        local_file: asset`clippy/SATANIC CLIPPY.mp3`,
      },
    }),
  });

  registerPhysicsCircle(EvilClippy);
  await EvilClippy.source.filter("OOF")?.setEnabled(false);
}

export async function wiggle() {
  raidHealth -= getRandomInt(1, 15);
  if (raidHealth <= 0) {
    await HealthBarFront.source.setSettings({
      width: 0,
    });
    await healthText.source.setSettings({
      text: "",
    });
    ClippyDead = 1;
    RaidTog(0);
  } else {
    await HealthBarFront.source.setSettings({
      width: healthbarwidth * (raidHealth / Fullhealth),
    });
    await healthText.source.setSettings({
      text: raidHealth.toString(),
    });
  }
  if (ClippyDead == 1) {
    ClippySpeech.remove();
    await EvilClippy.source.filter("OOF")?.setEnabled(false);
    unregisterPhysicsItem(EvilClippy);
    TMIClient.slow("jdudetv", 30);
    TMIClient.say(
      "jdudetv",
      "Congratulations you have killed clippy. Everything is now 5% cheaper POGGERS"
    );
    GenericVideo(
      "MSExplosion",
      MainWrapper,
      asset`Mine/Explode.mp4`,
      false,
      MainWrapper.item("EvilClippy")?.transform.positionX,
      MainWrapper.item("EvilClippy")?.transform.positionY,
      1.4,
      true
    );
    redemptionsStore.RAIDDISCOUNT();
    redemptionsStore.redemptions.forEach((data) => {
      redemptionsStore.updateRedemption(data);
    });
    await wait(1500);
    EvilClippy.remove();
    HealthBarFront.remove();
    healthText.remove();
    redemptionsStore.toggleRedemptions(
      [...redemptionsStore.redemptions.values()].map((r) => r.title),
      false,
      false
    );
    setTimeout(() => {
      TMIClient.slowoff("jdudetv");
    }, 5000);
  }
  console.log(raidHealth);

  let Rand = v4();

  let angle = 0;
  if (MainWrapper.item("EvilClippy") === undefined) return;

  if (MainWrapper.item("EvilClippy")!.transform.positionX < 960) {
    angle =
      90 -
      (Math.atan2(
        MainWrapper.item("EvilClippy")!.transform.positionY,
        960 - MainWrapper.item("EvilClippy")!.transform.positionX
      ) *
        180) /
        Math.PI;
  } else {
    angle = -(
      90 -
      (Math.atan2(
        MainWrapper.item("EvilClippy")!.transform.positionY,
        MainWrapper.item("EvilClippy")!.transform.positionX - 960
      ) *
        180) /
        Math.PI
    );
  }
  let image = `L:/Streaming/assets/images/bop.png`;
  const bop = await mainScene.createItem(image + Rand, {
    source: new ImageSource({
      name: image + Rand,
      settings: {
        file: image,
      },
    }),
    positionX: 960,
    positionY: 20,
    scaleX: 1,
    scaleY: 1,
    alignment: Alignment.Center,
  });
  let yVol = ((90 - Math.abs(angle)) / 90) * 10000;
  let xVol = (angle / 90) * 10000;
  registerPhysicsCircle(bop);
  const body = getBody(bop);
  if (body === undefined) return;
  body.mass = 100;
  body.velocity = [-xVol, yVol];
  setTimeout(async () => {
    unregisterPhysicsItem(bop);
    await wait(200);
    bop.remove();
  }, 2000);

  GenericSound(Math.random().toString(), asset`clippy/OOF.mp3`, -20, true);
  await EvilClippy.source.filter("OOF")?.setEnabled(true);
  setTimeout(() => {
    EvilClippy.source.filter("OOF")?.setEnabled(false);
  }, 500);
}
