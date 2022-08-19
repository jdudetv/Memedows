import { Alignment, Input, Scene } from "@sceneify/core";
import { ColorSource, GDIPlusTextSource, ImageSource } from "@sceneify/sources";
import { CropPadFilter } from "@sceneify/filters";
import { Easing, keyframe, keyframes, animate } from "@sceneify/animation";
import { EventPayloadMap } from "@memedows/types";
import { updateDoc, doc, increment } from "firebase/firestore";

import { TMIClient } from "~/data/services/emotes";
import { asset, wait } from "~/utils";
import { mainScene, obs } from "../Main";
import {
  registerMotionBlurItem,
  unregisterMotionBlurItem,
} from "../motionBlur";
import { toDegrees } from "../physics/utils";
import type Window from "../Window";
import { db } from "~/data/services/firebase";
import {
  redemptionEmitter,
  redemptionEnded,
} from "~/data/handlers/redemptions/base";
import { createVideoWindow, GenericSound, yeet } from ".";
import { FakeEvent, redemptionsStore, usersStore } from "~/data/stores";
export interface WheelOption {
  name: string;
  chance: number;
}

export async function randomWheelItems(data: any) {
  let WheelOptions = [
    { name: "HornyJail", chance: 10000 },
    { name: "Emote Only", chance: 1000 },
    { name: "Chaos", chance: 1000 },
    { name: "CrabRave", chance: 1000 },
    { name: "Free Ayaya", chance: 500 },
    { name: "5 pushups", chance: 1000 },
    { name: "Free Sub", chance: 10 },
    { name: "2 Free Spins", chance: 1000 },
    { name: "Free Dab", chance: 1000 },
    { name: "1000 xp", chance: 1000 },
    { name: "Timeout someone else", chance: 1000 },
    { name: "FIRESALE", chance: 5000 },
    { name: "Yeet", chance: 10000 },
    // { name: "OG CumZone", chance: 5000 },
    { name: "NUKE", chance: 1 },
  ];

  let WheelItems: any = [{ name: "HornyJail", chance: 10 }];
  for (let i = 1; i < 15; i++) {
    let x = Math.round(Math.random() * (WheelOptions.length - 1));
    WheelItems[i] = WheelOptions[x];
    WheelOptions.splice(x, 1);
  }
  WheelSpin(data, WheelItems);
}

export async function WheelSpin(
  redempData: EventPayloadMap["redemptionAdd"],
  wheelOptions: WheelOption[]
) {
  let wheelItemObject: any = {
    ColourSourceBackground: {
      source: new ColorSource({
        name: "WheelBackgroundColour",
        settings: {
          width: 1920,
          height: 1080,
          color: 0,
        },
      }),
      positionX: 960,
      positionY: 540,
      alignment: Alignment.Center,
    },
    background: {
      source: new ImageSource({
        name: "WheelBackground",
        settings: {
          file: asset`Images/Wheel.png`,
        },
      }),
      positionX: 960,
      positionY: 540,
      alignment: Alignment.Center,
      rotation: 0,
    },
  };

  const WHEEL_SIZE = 996;

  for (let i = 0; i < 15; i++) {
    const angle = 0.1 + (2 * Math.PI * i) / 15;
    const x = 1920 / 2 - (WHEEL_SIZE / 2 - 20) * Math.cos(angle);
    const y = 1080 / 2 - (WHEEL_SIZE / 2 - 20) * Math.sin(angle);

    wheelItemObject[`item${i}`] = {
      source: new GDIPlusTextSource({
        name: `Option${i}`,
        settings: {
          text: `Option${i}`,
          font: {
            face: "Comic Sans MS",
            size: 100,
            style: "Regular",
          },
          // @ts-ignore
          outline: true,
          outline_color: 0,
          outline_size: 30,
        },
      }),
      positionX: x,
      positionY: y,
      scaleX: 0.4,
      scaleY: 0.4,
      alignment: Alignment.CenterLeft,
      rotation: toDegrees(angle),
    };
  }

  const WheelScene = await new Scene({
    name: "Wheel",
    items: wheelItemObject,
  }).create(obs);

  await mainScene.createItem("WheelWindow", {
    source: WheelScene,
    positionX: 2500,
    positionY: 540,
    alignment: Alignment.Center,
    scaleX: 0.55,
    scaleY: 0.55,
  });

  // registerMotionBlurItem(mainScene.item("WheelWindow"));

  WheelScene.addFilter(
    "crop",
    new CropPadFilter({
      name: "CropWheel",
      settings: {
        left: 420,
        right: 420,
      },
    })
  );

  let totalweight = 0;
  const sceneItems = mainScene.item("WheelWindow")!.source as Window;
  wheelOptions.forEach((data, index) => {
    totalweight += data.chance;
    (sceneItems.item(`item${index}`)!.source as Input).setSettings({
      text: data.name,
    });
  });

  let randomItem = Math.random() * totalweight;

  for (let i = 0; i < wheelOptions.length; i++) {
    randomItem -= wheelOptions[i].chance;
    if (randomItem <= 0) {
      WheelAnimation(i);
      await wait(6000);
      setTimeout(() => {
        prizeLogic(wheelOptions[i].name.toLocaleLowerCase(), redempData);
      }, 5000);
      break;
    }
  }

  async function prizeLogic(
    name: string,
    redempData: EventPayloadMap["redemptionAdd"]
  ) {
    TMIClient.say("jdudetv", redempData.userName + " Landed on " + name);
    switch (name.toLocaleLowerCase()) {
      case "hornyjail":
        TMIClient.say(
          "jdudetv",
          redempData.userName +
            " You have 10 seconds to say your last words. Enjoy horny jail."
        );
        await wait(10000);
        GenericSound("Bonk", asset`sounds/Bonk meme.mp3`, 0, false);
        await wait(300);
        GenericSound("HornyJail", asset`sounds/HORNYSHORT.mp3`, 0, false);
        TMIClient.timeout("jdudetv", redempData.userName, 69, "horny jail");
        TMIClient.timeout("ocefam", redempData.userName, 69, "horny jail");
        console.log("jail visits increment");
        if (redempData.userId !== undefined) {
          console.log("test");
          usersStore.addHorny(redempData.userId);
        }
        break;
      case "emote only":
        TMIClient.say(
          "jdudetv",
          redempData.userName + " Has given us emote only mode."
        );
        TMIClient.emoteonly("jdudetv");
        setTimeout(() => {
          TMIClient.emoteonlyoff("jdudetv");
        }, 60000);
        break;
      case "chaos":
        FakeEvent("chaos");
        break;
      case "free ayaya":
        FakeEvent("ayaya");
        break;
      case "free dab":
        FakeEvent("dab");
        break;
      case "yeet":
        FakeEvent("yeet");
        break;
      case "crabrave":
        FakeEvent(
          "crabrave",
          redempData.userName,
          `${redempData.userName} is stinky`
        );
        break;
      case "5 squats":
        TMIClient.say("jdudetv", "Enjoy doing 5 squats josh, get buff.");
        updateDoc(doc(db, "public", "josh-stats"), {
          "squats.total": increment(5),
        });
        break;
      case "5 pushups":
        TMIClient.say("jdudetv", "Enjoy doing 5 pushups josh, get buff.");
        updateDoc(doc(db, "public", "josh-stats"), {
          "pushups.total": increment(5),
        });
        break;
      case "timeout someone else":
        TMIClient.say(
          "jdudetv",
          redempData.userName +
            " You have gotten a timeout token. Use !timeout [username] to timeout someone else in chat!"
        );
        usersStore.addTimeout(redempData.userId);
        break;
      case "1000 xp":
        TMIClient.say(
          "jdudetv",
          redempData.userName + " You just won 1000 XP on memedows.!"
        );
        console.log(redempData.userId);
        usersStore.grantXp(redempData.userId, 1000);
        break;
      case "2 free spins":
        FakeEvent(
          "wheelofmemefortune",
          redempData.userName,
          redempData.input,
          redempData.userId
        );
        FakeEvent(
          "wheelofmemefortune",
          redempData.userName,
          redempData.input,
          redempData.userId
        );
        break;
      case "og cumzone":
        createVideoWindow(mainScene, "OGCUM");
        break;
      case "firesale":
        let redemptionNames = [
          "dab",
          "pizzatime",
          "crabrave",
          "saxaphone",
          "recordscratch",
          "breakingnews",
          "ayaya",
          "wot",
          "cowboy",
          "",
        ];
        let redemptionName =
          redemptionNames[Math.round(Math.random() * redemptionNames.length)];
        console.log(redemptionName);
        redemptionsStore.redemptions.forEach((data) => {
          if (data.title.toLocaleLowerCase() == redemptionName) {
            let TempCostStorage = data.defaultcost;
            data.defaultcost = 1;
            redemptionsStore.updateRedemption(data);
            redemptionEmitter.once(redemptionName.toLowerCase(), () => {
              data.defaultcost = TempCostStorage;
              redemptionsStore.updateRedemption(data);
            });
          }
        });
        break;
    }
  }

  async function WheelAnimation(Position: number) {
    if (Position > 14 || Position < 0) return;
    const angle = -0.1 + (-2 * Math.PI * Position) / 15;

    const wheelItem = mainScene.item("WheelWindow");
    GenericSound("WheelBeSpinning", asset`sounds/wheelSpin.mp3`);
    animate({
      subjects: {
        wheel: wheelItem!,
      },
      keyframes: {
        wheel: {
          rotation: {
            0: 1800,
            6000: keyframe(toDegrees(angle) - 1080, Easing.Out),
          },
          positionX: {
            0: 2500,
            1000: keyframe(1940, Easing.Out),
            6000: 1940,
            7000: keyframe(2500, Easing.In),
          },
        },
      },
    });

    setTimeout(() => {
      // unregisterMotionBlurItem(mainScene.item("WheelWindow")!);
      console.log("wheel finished");
      redemptionEnded("wheelofmemefortune");
    }, 8000);
  }
}
