import { wait } from "@sceneify/animation";
import { Alignment } from "@sceneify/core";
import { GDIPlusTextSource } from "@sceneify/sources";
import { localDB } from "~/data/jsondb";
import { FakeEvent } from "~/data/stores";
import { mainScene, MainWrapper } from "~/obs/Main";
import {
  getBody,
  registerPhysicsItem,
  unregisterPhysicsItem,
  updateBoundsForItem,
} from "~/obs/physics";
import { GenericSound, TTSFunction } from "~/obs/redemptions";
import { asset, HEXtoOBS } from "~/utils";
import { createRedemptionHandler, redemptionEnded } from "./base";

createRedemptionHandler({
  event: "subscriptionlogic",
  handler: async (data) => {
    console.log("teset");
    // redemptionEnded("subscriptionlogic");
    SubAlert(data.userName, JSON.parse(data.input));
  },
});

interface DataStructure {
  tier: number;
  cumulative: number;
}

async function SubAlert(name: string, data: DataStructure) {
  let hex = "FFFFFF";
  try {
    hex = localDB.getData(`/store/chatcolors/${name.toLowerCase()}`);
    if (hex === null) hex = "FFFFFF";
  } catch (error) {
    console.log("name not found");
    console.log(error);
  }

  let color = Number("0xFF" + HEXtoOBS(hex));

  let textscreen = await MainWrapper.createItem(name, {
    source: new GDIPlusTextSource({
      name: name + " big",
      settings: {
        text:
          name.toUpperCase() +
          (data.cumulative > 1
            ? " x " + data.cumulative + " Months"
            : " Subscribed for the first time"),
        color: color,
        font: {
          size: 100,
          face: "Comic Sans MS",
        },
        align: "center",
        valign: "center",
      } as any,
    }),
    positionX: 960,
    positionY: 540,
    alignment: Alignment.Center,
  });
  let delay = 300;

  await mainScene.createItem(name, {
    source: new GDIPlusTextSource({
      name,
      settings: {
        text: name.toUpperCase(),
        color: color,
        font: {
          size: 100,
          face: "Comic Sans MS",
        },
        align: "center",
        valign: "center",
      } as any,
    }),
    positionX: Math.random() * 1020 + 500,
    positionY: -200,
    alignment: Alignment.Center,
  });
  await wait(data.cumulative * delay);
  let Name = await mainScene.createItem(name, {
    source: new GDIPlusTextSource({
      name,
      settings: {
        text: name.toUpperCase(),
        color: color,
        font: {
          size: 100,
          face: "Comic Sans MS",
        },
        align: "center",
        valign: "center",
        wrap: false,
      } as any,
    }),
    positionX: Math.random() * 1020 + 500,
    positionY: -200,
    alignment: Alignment.Center,
  });
  console.log(Name);
  registerPhysicsItem(Name, {
    getBounds: () => ({
      height: Name.transform.sourceHeight - 40,
      width: Name.transform.sourceWidth,
      offset: {
        x: 0,
        y: -5,
      },
    }),
  });
  setTimeout(() => {});
  setTimeout(() => {
    unregisterPhysicsItem(Name);
  }, 30000 * data.cumulative);

  //IF ELSE TREE BELOW FOR EACH MONTH SETUP

  if (data.cumulative == undefined || data.cumulative == null) {
    GenericSound("freshSubSound", asset`sub/FreshSub.mp3`, -25, true);
    FakeEvent("explosion");
    setTimeout(() => {
      TTSFunction(
        `${name} Has just become a memeber of the OCEFAM for the first time!! Get some spicies in chat`,
        true
      );
    }, 5000);
    setTimeout(() => {
      redemptionEnded("subscriptionlogic");
    }, 11000);
  } else if (data.cumulative < 12) {
    TTSFunction(
      `${name} Has just resubscribed for ${data.cumulative} months. Get some spicies in chat`,
      true
    );
    await GenericSound("freshSubSound", asset`sub/Firstyear.mp3`, -25, true);
    redemptionEnded("subscriptionlogic");
  }
}
