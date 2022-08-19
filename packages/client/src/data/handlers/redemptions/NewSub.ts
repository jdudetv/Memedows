import { wait } from "@sceneify/animation";
import { Alignment } from "@sceneify/core";
import { GDIPlusTextSource } from "@sceneify/sources";
import { FakeEvent } from "~/data/stores";
import { mainScene } from "~/obs/Main";
import {
  getBody,
  registerPhysicsItem,
  unregisterPhysicsItem,
  updateBoundsForItem,
} from "~/obs/physics";
import { GenericSound, TTSFunction } from "~/obs/redemptions";
import { asset } from "~/utils";
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
  let delay = 300;
  if (data.cumulative >= 0) {
    for (let x = 0; x < data.cumulative; x++) {
      setTimeout(() => {
        FakeEvent("explosion");
      }, x * delay);
    }
    setTimeout(() => {
      redemptionEnded("subscriptionlogic");
    }, data.cumulative * delay + 5000);
  }
  await wait(data.cumulative * delay);
  await mainScene.createItem(name, {
    source: new GDIPlusTextSource({
      name,
      settings: {
        text: name.toUpperCase(),
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
  let Name = await mainScene.createItem(name, {
    source: new GDIPlusTextSource({
      name,
      settings: {
        text: name.toUpperCase(),
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
