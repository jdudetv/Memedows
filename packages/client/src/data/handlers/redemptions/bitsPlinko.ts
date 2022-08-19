import { wait } from "@sceneify/animation";
import { Alignment } from "@sceneify/core";
import { ImageSource } from "@sceneify/sources";
import { TMIClient } from "~/data/services/emotes";
import {
  getPlinko,
  registerPlinkoItem,
  unregisterPlinkoItem,
  updateBoundsForPlinko,
} from "~/obs/bitsPlinko";
import { mainScene, plinkoContainer, plinkoWindow } from "~/obs/Main";
import { asset } from "~/utils";
import {
  createRedemptionHandler,
  redemptionEmitter,
  redemptionEnded,
} from "./base";
import { v4 as uuidv4 } from "uuid";
import {
  FakeEvent,
  redemptionsStore,
  RedemptionsStore,
  usersStore,
} from "~/data/stores";
import Redemptions from "~/routes/redemptions";
import { createVideoWindow } from "~/obs/redemptions";
import { localDB } from "~/data/jsondb";
import { db } from "~/data/services/firebase";
import { updateDoc, doc, increment } from "firebase/firestore";

let runningBits = 0;

const bitPositions = [1170, 1120, 1070, 1020, 970, 920, 870, 820, 770, 720];

createRedemptionHandler({
  event: "bitsplinko",
  handler: async (data) => {
    redemptionEnded("bitsplinko");
    let bitname = "bit" + uuidv4();
    runningBits += 1;
    if (mainScene.item("plinkoWindow").minimised)
      mainScene.item("plinkoWindow").toggleMinimised(false);
    await wait(500);
    const element = await plinkoContainer.createItem(bitname, {
      source: new ImageSource({
        name: bitname,
        settings: {
          file: asset`plinko/PlinkoBall.png`,
        },
      }),
      enabled: false,
      // positionX: 960,
      positionY: 200,
      positionX: Math.random() * 200 + 860,
      // positionY: Math.random() * 980 + 100,
      alignment: Alignment.Center,
      scaleX: 0.15,
      scaleY: 0.15,
      rotation: Math.random() * 360,
    });

    await element.setEnabled(true);

    registerPlinkoItem(element);
    const body = getPlinko(element)!;
    const angle = Math.random() * Math.PI;
    body.angularVelocity = Math.random() * 30 - 15;
    updateBoundsForPlinko(element);
    await wait(500);
    let loopcheck = setInterval(async () => {
      if (element.transform.positionY > 910) {
        clearInterval(loopcheck);
        console.log("bottom");
        unregisterPlinkoItem(element);
        await wait(3000);
        await element.remove();
        runningBits -= 1;
        for (const [index, item] of bitPositions.entries()) {
          if (element.transform.positionX > item) {
            console.log(index);
            prize(index + 1, data.userName, data.userId, Number(data.input));
            return;
          }
        }
      }
    }, 100);
  },
});

async function prize(
  number: number,
  username: string,
  id: string,
  amount: number
) {
  setTimeout(() => {
    if (runningBits == 0 && mainScene.item("plinkoWindow").minimised == false)
      mainScene.item("plinkoWindow").toggleMinimised(false);
  }, 5000);
  TMIClient.say("jdudetv", `${username} landed in position ${11 - number}`);
  console.log(number);
  let switchValue = 11 - number;
  switch (switchValue) {
    case 1:
      redemptionsStore.PermDiscount(-0.01);
      break;
    case 2:
      usersStore.grantXp(id, -amount);
      break;
    case 3:
      FakeEvent("thanossnap");
      break;
    case 4:
      let spins = Math.round(amount / 200);
      for (let x = 0; x < spins; x++) {
        FakeEvent("wheelofmemefortune", username, "Plinko boi", id);
      }
      break;
    case 5:
      TMIClient.say("jdudetv", "Enjoy doing 5 pushups josh, get buff.");
      updateDoc(doc(db, "public", "josh-stats"), {
        "pushups.total": increment(5),
      });
      break;
    case 6:
      FakeEvent("ttschat");
      break;
    case 7:
      FakeEvent("ayaya");
      break;
    case 8:
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
    case 9:
      usersStore.grantXp(id, amount * 10);
      break;
    case 10:
      redemptionsStore.PermDiscount(0.01);
      break;
  }
}
