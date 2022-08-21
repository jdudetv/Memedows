import { redemptionEmitter } from "~/data/handlers/redemptions/base";
import { mainScene, MainWrapper, obs } from "~/obs/Main";
import { streamdeckEmitter } from "~/data/services/streamdeck";
import {
  hypeTrainBegin,
  hypeTrainEnd,
  hypeTrainProgress,
} from "~/obs/hypeTrain";
import { world } from "~/obs/physics";
import { eventsStore, FakeEvent, feedStore, newUser } from "../stores";
import { createVideoWindow } from "~/obs/redemptions";
import Window, { WindowItem } from "~/obs/Window";
import { Alignment, Scene } from "@sceneify/core";
import { cameraVideoIcon } from "~/obs/sprites";
import { localDB } from "../jsondb";
import { animate, Easing, keyframe } from "@sceneify/animation";
import { getRandomInt, wait } from "~/utils";
import { startup } from "~/obs/startup";
import { toggleStartMenu } from "~/obs/startMenu";
import { Shutdown } from "~/obs/shutdown";
import { CreatePoll } from "../services/twitchApi";
import {
  amountAlerts,
  DonationRefundHandling,
  EventFeed,
  HypeTrain,
  SecretBit,
  SubAlert,
} from ".";
import { World } from "p2";
import { raidFunc } from "./raid";
import { doc, increment, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase";

streamdeckEmitter.removeAllListeners();

let HTProgress = 1;

streamdeckEmitter.on("keyDown:yeet", async () => {
  FakeEvent("yeet");
  // redemptionEmitter.emitAsync("yeet", {});
});

const directory = import.meta.env.VITE_VIDEOS_DIRECTORY;

streamdeckEmitter.on("keyDown:ohthese", async () => {
  createVideoWindow(mainScene, "CAT");
});

streamdeckEmitter.on("keyDown:togglechat", async () => {
  // @ts-ignore
  mainScene.item("chatWindow").toggleMinimised(true);
});

streamdeckEmitter.on("keyDown:testing", async () => {
  raidFunc({ viewers: 10, fromId: "1", fromName: "jdude" });
});

streamdeckEmitter.on("keyDown:hypeTrainEvent:begin", async () => {
  hypeTrainBegin();
});

streamdeckEmitter.on("keyDown:hypeTrainEvent:progress", async () => {
  hypeTrainProgress(HTProgress, 0.5, 1);
  if (HTProgress !== 5) HTProgress++;
});

streamdeckEmitter.on("keyDown:hypeTrainEvent:end", async () => {
  hypeTrainEnd();
  HypeTrain(6);
  // hypeTrainProgress(5, 1.2, 1);
});

streamdeckEmitter.on("keyDown:start", async () => {
  if (localDB.getData("store/started") === 1) return;
  localDB.push("store/started", 1);
  startup();
});

streamdeckEmitter.on("keyDown:shutdown", async () => {
  Shutdown();
});

streamdeckEmitter.on("keyDown:poll", async () => {});

streamdeckEmitter.on("keyDown:display", async () => {
  if (mainScene.item("desktopCapture").enabled === false) {
    mainScene.item("desktopCapture").setEnabled(true);
  } else {
    mainScene.item("desktopCapture").setEnabled(false);
  }
});

streamdeckEmitter.on("keyDown:pushupsDone", async () => {
  updateDoc(doc(db, "public", "josh-stats"), {
    "pushups.completed": increment(5),
  });
});

streamdeckEmitter.on("keyDown:squatsDone", async () => {
  updateDoc(doc(db, "public", "josh-stats"), {
    "squats.completed": increment(5),
  });
});

streamdeckEmitter.on("keyDown:resetSquats", async () => {
  updateDoc(doc(db, "public", "josh-stats"), {
    "squats.completed": 0,
    "squats.total": 0,
  });
});

streamdeckEmitter.on("keyDown:resetPushups", async () => {
  updateDoc(doc(db, "public", "josh-stats"), {
    "pushups.completed": 0,
    "pushups.total": 0,
  });
});

streamdeckEmitter.on("keyDown:startReset", async () => {
  localDB.push("store/started", 0);
  localDB.push("/store/chaostog", 0);
  console.log("resetting");
  localDB.push("/store/chatters/", []);
  localDB.push("/store/phase", 1);
  let data = {
    subscriptionAmount: 0,
    subscriptionThreshold: 10,
    subscriptionMultiplier: 1,
    cheerAmount: 0,
    cheerThreshold: 5000,
    cheerMultiplier: 1,
    donationAmount: 0,
    donationThreshold: 5000,
    donationMultiplier: 1,
    timer: 0,
    subBuffer: 0,
    RefundEvent: 0,
    RefundCountdown: 0,
    FreeTier: "yeet",
    RefundsHit: 0,
    FreeTierTimer: 0,
  };
  localDB.push("store/refund/variables", data);
  localDB.push("/store/cam/health", 5000);
});

streamdeckEmitter.on("keyDown:world", async () => {
  // EventFeed("giftsubscribe", "jdudetv", {total: 1});
  // raidFunc({viewers: 10, fromId: "", fromName: ""});
  FakeEvent("dvd", "", "");
  // createVideoWindow(mainScene, "OGCUM");
  // console.log(feedStore.events.find(thing => "generalbot395" == thing.name.toLowerCase())?.data.receipients.length);
  // FakeEvent("subscriptionlogic", "queereokerules", JSON.stringify({tier: 1, cumulative: 1}));
  // console.log(
  //   await obs.call("GetSceneItemTransform", {
  //     sceneName: "MainWrapper",
  //     "sceneItemId"
  //   })
  // );
});

streamdeckEmitter.on("keyDown:startmenu", async () => {
  toggleStartMenu();
});
