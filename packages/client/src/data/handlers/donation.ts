import { Alignment, MonitoringType, Scene } from "@sceneify/core";
import { MediaSource } from "@sceneify/sources";
import { CompressorFilter } from "@sceneify/filters";
import { v4 as uuidv4 } from "uuid";

import { mainScene } from "~/obs/Main";
import Window from "~/obs/Window";
import { KofiDonation } from "../services/Kofi";
import { asset, assetString } from "~/utils";
import { redemptionEmitter } from "./redemptions/base";
import { alertStore, AlertData } from "../stores/alerts";
import { eventsStore, FakeEvent, usersStore } from "../stores";
import { GenericSound, TTSFunction } from "~/obs/redemptions";
import { GetID } from "../services/twitchApi";

export async function Donation(donationData: KofiDonation) {
  let AmountHalf = Math.round(parseInt(donationData.amount) / 2);
  let donoAmount = parseFloat(
    (parseFloat(donationData.amount) * 100).toFixed(2)
  );
  console.log(donoAmount);
  let username = donationData.from_name;
  let message = donationData.message;
  let ID = "0";
  amountAlerts(donoAmount, message, username, "Dono");
  let TEMP = await GetID(username);
  if (TEMP !== undefined) {
    ID = TEMP;
  }
  for (let i = 0; i < AmountHalf; i++) {
    console.log("wheel being added from dono");
    FakeEvent("wheelofmemefortune", username, message, ID);
  }
}

export async function amountAlerts(
  amount: number,
  message: string,
  username: string,
  FLAG: string
) {
  console.log("amountAlerts: " + amount);
  let video: AlertData | null = null;
  if (amount >= 10000) {
    GenericSound("AYAY 10 MINS", asset`sounds/ayaya10.mp3`, -10, true, 0);
  }
  if (amount > 50) TTSFunction(message);
  console.log(amount);

  for (let [index, dono] of alertStore.alerts.entries()) {
    if (amount === dono.amount) {
      video = dono;
      console.log("1");
      break;
    }
    if (amount > alertStore.alerts[alertStore.alerts.length - 1].amount) {
      video = alertStore.alerts[alertStore.alerts.length - 1];
      console.log("2");
      break;
    }
    console.log(dono.amount);
    if (dono.amount >= amount) {
      console.log("3");
      for (let i = index - 1; i >= 0; i--) {
        if (!alertStore.alerts[i].exact) {
          console.log("4");
          if (
            FLAG === "Dono" &&
            alertStore.alerts[i].donoVideo &&
            alertStore.alerts[i].donoVideo !== ""
          ) {
            console.log("5");
            video = alertStore.alerts[i];
            break;
          }
          if (
            FLAG === "Bits" &&
            alertStore.alerts[i].bitVideo &&
            alertStore.alerts[i].bitVideo !== ""
          ) {
            console.log("6");
            video = alertStore.alerts[i];
            break;
          }
          if (alertStore.alerts[i].redemption) {
            console.log("9");
            video = alertStore.alerts[i];
            let UserID = await GetID(username);
            FakeEvent(
              video.redemption!.toLowerCase(),
              username,
              message,
              UserID
            );
            return;
          }
        }
      }
      console.log("7");
      break;
    }
  }

  if (!video) {
    console.warn("bruh no video");
    return;
  }
  console.log(video);
  if (FLAG === "Dono" && video.donoVideo)
    await addAlertVideo(video.donoVideo, video.ScenePlayed);
  if (FLAG === "Bits" && video.bitVideo)
    await addAlertVideo(video.bitVideo, video.ScenePlayed);
  if (video.redemption) {
    let UserID = await GetID(username);
    FakeEvent(video.redemption.toLowerCase(), username, message, UserID);
  }
}

async function addAlertVideo(videoAmount: string, WindowToAd: string) {
  let scene: Scene;
  if (WindowToAd == "Main") {
    scene = mainScene;
  } else {
    WindowToAd = WindowToAd + "Window";
    scene = (mainScene.item(WindowToAd)!.source as Window).item(
      "content"
    ).source;
  }

  const alertSt = videoAmount.toString();
  const AlertRef = videoAmount.toString() + uuidv4();

  const AlertVideo = await scene.createItem(AlertRef, {
    source: new MediaSource({
      name: AlertRef,
      settings: {
        local_file: assetString(`Alerts/${videoAmount}.webm`),
      },
      filters: {
        limiter: new CompressorFilter({
          name: "AudioLimiter",
          settings: { ratio: 20, threshold: -22 },
        }),
      },
      audioMonitorType: MonitoringType.MonitorAndOutput,
    }),
    positionX: 960,
    positionY: 540,
    alignment: Alignment.Center,
    scaleX: 1,
    scaleY: 1,
    rotation: 0,
  });

  return new Promise((res: any) => {
    AlertVideo.source.once("PlaybackEnded", async () => {
      await AlertVideo.remove();
      res();
    });
  });
}
