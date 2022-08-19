import tmi from "tmi.js";
import { bitsContainer, bitsScene, mainScene } from "~/obs/Main";
import { v4 as uuidv4 } from "uuid";
import { localDB } from "../jsondb";
import { Alignment } from "@sceneify/core";
import { ImageSource } from "@sceneify/sources";
import { Easing, keyframe, animate } from "@sceneify/animation";
import {
  getBody,
  registerPhysicsItem,
  unregisterPhysicsItem,
  updateBoundsForItem,
} from "~/obs/physics";
import { wait } from "~/utils";

import path from "path";
import fs from "fs";
import crypto from "crypto";
import { writeFile } from "fs/promises";
import {
  getBits,
  registerBitsItem,
  unregisterBitsItem,
  updateBoundsForBits,
} from "~/obs/Physicsbits";

const EMOTE_COUNT = 20;
const EMOTE_TIMEOUT = 5000;
const EMOTE_SIZE = 45;

let EmoteUsage = {} as any;

setInterval(() => {
  for (const ID in EmoteUsage) {
    if (EmoteUsage[ID] > 0) {
      EmoteUsage[ID]--;
    }
  }
}, 5000);

const gifRegexp = /^GIF8[79]a/;
const pngFriedChunkName = "CgBI";

const decoder = new TextDecoder("utf-8");

export const TMIClient = new tmi.Client({
  options: {
    debug: false,
    skipUpdatingEmotesets: true,
  },
  connection: {
    secure: true,
    reconnect: true,
  },
  identity: {
    username: "OCEFAM",
    password: import.meta.env.VITE_TMI_TOKEN,
  },
  channels: ["jdudetv", "ocefam"],
});

const emoteFolder = path.join(process.cwd(), "temp", "emotes");
fs.mkdirSync(emoteFolder, { recursive: true });

interface EmoteIDK {
  url: string;
  file: string;
  lastUpdated: string;
  animated: boolean;
  width: number;
  height: number;
}
const TIME_DAY = 1000 * 60 * 60 * 24;
const emoteList = localDB.getObject<EmoteIDK[]>("store/chat/emotes");

function getImageType(buffer: ArrayBuffer) {
  const signature = decoder.decode(new DataView(buffer.slice(0, 6)));
  if (gifRegexp.test(signature)) {
    const headerBytes = new Uint8Array(buffer.slice(6, 10));
    const width = headerBytes[0] | (headerBytes[1] << 8);
    const height = headerBytes[2] | (headerBytes[3] << 8);
    return {
      width,
      height,
      animated: true,
    };
  } else {
    // PNG width, height
    const dv = new DataView(buffer);
    const decoder = new TextDecoder("utf-8");
    if (
      decoder.decode(new DataView(buffer.slice(12, 16))) === pngFriedChunkName
    ) {
      return {
        height: dv.getUint32(36),
        width: dv.getUint32(32),
        animated: false,
      };
    }
    return {
      height: dv.getUint32(20),
      width: dv.getUint32(16),
      animated: false,
    };
  }
}

async function getOrCreateEmote(url: string): Promise<EmoteIDK> {
  const storedEmotes = localDB.getObject<EmoteIDK[]>("store/chat/emotes");
  const e = storedEmotes.find((entry: any) => entry.url === url);
  if (e == undefined) {
    const file = path.join(
      emoteFolder,
      crypto.createHash("sha256").update(url).digest("hex")
    );

    const response = await fetch(url);
    const buffer = await response.arrayBuffer();

    const imageType = getImageType(buffer);
    const width = imageType.width;
    const height = imageType.height;
    const animated = imageType.animated;

    const emoteFile = file + (animated ? ".gif" : ".png");
    await writeFile(emoteFile, Buffer.from(buffer));

    const e = {
      url,
      file: emoteFile,
      lastUpdated: new Date().toISOString(),
      animated,
      width,
      height,
    } as EmoteIDK;
    localDB.push("store/chat/emotes[]", e);
    return e;
  }

  if (!fs.existsSync(e.file)) {
    const list = localDB.getObject<EmoteIDK[]>("store/chat/emotes");
    localDB.push(
      "store/chat/emotes",
      list.filter((e) => e.url !== url)
    );
    return await getOrCreateEmote(url);
  }

  return e;
}

async function renderEmote(elementref: string, url: string) {
  const e = await getOrCreateEmote(url);

  const element = await mainScene.createItem(elementref, {
    source: new ImageSource({
      name: elementref,
      settings: {
        file: e.file,
      },
    }),
    // positionX: 960,
    // positionY: 540,
    positionX: Math.random() * 1720 + 100,
    positionY: Math.random() * 980 + 100,
    alignment: Alignment.Center,
    scaleX: e.height < 25 ? 2 : 1,
    scaleY: e.height < 25 ? 2 : 1,
    rotation: Math.random() * 360,
  });

  // element.properties.width = width > 70 ? width * 2 : width;
  // element.properties.height = width > 70 ? height * 2 : height;

  // registerBitsItem(element);
  // const body = getBits(element)!;
  // const angle = Math.random() * Math.PI;
  // body.velocity = [500 * Math.cos(angle) + body.velocity[0], 0];
  // body.angularVelocity = (Math.random() - 0.5) * 30;
  // updateBoundsForBits(element);

  setTimeout(async () => {
    // unregisterBitsItem(element);

    await animate({
      subjects: {
        element,
      },
      keyframes: {
        element: {
          scaleX: { 300: keyframe(0, Easing.In) },
          scaleY: { 300: keyframe(0, Easing.In) },
          rotation: {
            300: keyframe(element.transform.rotation + 360, Easing.In),
          },
        },
      },
    });

    try {
      element.remove();
    } catch {}
  }, EMOTE_TIMEOUT);
}

export async function initializeTwitchChat() {
  const bttvEmotes = await fetch(
    "https://api.betterttv.net/3/cached/users/twitch/25118940"
  ).then((value) => value.json());

  const bttvGlobalEmotes = await fetch(
    "https://api.betterttv.net/3/cached/emotes/global"
  ).then((value) => value.json());

  const ffzEmotes = await fetch(
    "https://api.frankerfacez.com/v1/room/id/25118940"
  ).then((value) => value.json());

  const ffzGlobalEmotes = await fetch(
    "https://api.frankerfacez.com/v1/set/global"
  ).then((value) => value.json());

  const customEmotes: Record<string, { url: string }> = {};
  bttvEmotes.channelEmotes.forEach((value: any) => {
    customEmotes[value.code] = {
      url: `https://cdn.betterttv.net/emote/${value.id}/3x`,
    };
  });
  bttvEmotes.sharedEmotes.forEach((value: any) => {
    customEmotes[value.code] = {
      url: `https://cdn.betterttv.net/emote/${value.id}/3x`,
    };
  });
  bttvGlobalEmotes.forEach((value: any) => {
    customEmotes[value.code] = {
      url: `https://cdn.betterttv.net/emote/${value.id}/3x`,
    };
  });

  for (const [key, value] of Object.entries(ffzEmotes["sets"])) {
    // @ts-ignore
    value["emoticons"].forEach((value: any) => {
      customEmotes[value.name] = {
        url:
          "https:" +
          (value.urls["4"] ||
            value.urls["3"] ||
            value.urls["2"] ||
            value.urls["1"]),
      };
    });
  }

  for (const [key, value] of Object.entries(ffzGlobalEmotes["sets"])) {
    // @ts-ignore
    value["emoticons"].forEach((value: any) => {
      customEmotes[value.name] = {
        url:
          "https:" +
          (value.urls["4"] ||
            value.urls["3"] ||
            value.urls["2"] ||
            value.urls["1"]),
      };
    });
  }

  const emoteNames = Object.keys(customEmotes);

  TMIClient.connect().catch(console.error);
  console.log("Chat init");

  TMIClient.on("message", async (channel, tags, message, self) => {
    if (message.toLowerCase().includes("bop")) return;
    if (channel === "#ocefam") return;
    if (tags.emotes != null) {
      for (const ID in tags.emotes) {
        await wait(100);
        const elementref = ID + uuidv4();
        const url = `https://static-cdn.jtvnw.net/emoticons/v2/${ID}/default/dark/3.0`;

        await renderEmote(elementref, url);
        // console.log(tags.emotes[ID].length);
        // EmoteUsage[ID] = EmoteUsage[ID]
        //   ? (EmoteUsage[ID] += Math.round(tags.emotes[ID].length))
        //   : Math.round(tags.emotes[ID].length);
        // if (EmoteUsage[ID] > 0) {
        //   for (let i = 0; i < EmoteUsage[ID]; EmoteUsage[ID]--) {

        //   }
      }
    }
    const emoteCounts: Record<string, number> = {};
    const messageSplit = message.split(" ");
    for (let msg of messageSplit) {
      if (emoteNames.includes(msg)) {
        if (emoteCounts[msg]) {
          emoteCounts[msg] += 1;
        } else {
          emoteCounts[msg] = 1;
        }
      }
    }

    for (const [key, value] of Object.entries(emoteCounts)) {
      await wait(100);
      const elementref = key + uuidv4();
      const url = customEmotes[key].url;

      await renderEmote(elementref, url);
      // EmoteUsage[key] = EmoteUsage[key]
      //   ? (EmoteUsage[key] += Math.round(value))
      //   : Math.round(value);
      // if (EmoteUsage[key] > 0) {
      //   for (let i = 0; i < EmoteUsage[key]; EmoteUsage[key]--) {

      //   }
      // }
    }
  });
}
