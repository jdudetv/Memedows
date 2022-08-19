/**
 * @jest-environment jsdom
 */

import { transaction } from "mobx";
import { Alignment, Scene } from "@sceneify/core";
import { GDIPlusTextSource, ImageSource } from "@sceneify/sources";
import { animate, Easing, keyframe } from "@sceneify/animation";
import { mainScene, MainWrapper, obs } from "~/obs/Main";
import { MuteMic, UnmuteMic } from "~/obs/MuteMic";
import { GenericSound } from "~/obs/redemptions";
import { asset, wait } from "~/utils";
import { createRedemptionHandler, redemptionEnded } from "./base";

createRedemptionHandler({
  event: "WOT",
  handler: async (data) => {
    GenericSound("RecordScratchSound", asset`sounds/wot.mp3`, -30, false);
    mainScene.filter("WOTFreeze")?.setEnabled(true);
    MuteMic(obs);
    let WOTscene = await new Scene({
      name: "WOTSCene",
      items: {
        Stream: {
          source: mainScene,
          positionX: 960,
          positionY: 400,
          alignment: Alignment.Center,
          scaleX: 0.46,
          scaleY: 0.46,
        },
        WOTOverlay: {
          source: new ImageSource({
            name: "WotOverlay",
            settings: {
              file: asset`images/wot.png`,
            },
          }),
          scaleX: 1.25,
          scaleY: 1.25,
          positionX: 960,
          positionY: 500,
          alignment: Alignment.Center,
        },
        WOTText: {
          source: new GDIPlusTextSource({
            name: "WOTTEXT",
            settings: {
              text: data.input,
              font: {
                face: "Comic Sans MS",
                size: 70,
              },
              outline: true,
              extents: true,
              extents_cx: 1920,
              extents_cy: 8000,
              outline_size: 10,
              outline_color: 0xff000000,
              align: "center",
              valign: "top",
            } as any,
          }),
          positionX: 960,
          positionY: 670,
          alignment: Alignment.TopCenter,
        },
      },
    }).create(obs);
    let mainWrapped = await MainWrapper.createItem("WotAdded", {
      source: WOTscene,
    });
    // obs
    //   .send("TakeSourceScreenshot", {
    //     sourceName: "WOTSCene",
    //     // embedPictureFormat: "png",
    //     saveToFilePath: asset`/images/WotImage.png`,
    //   })
    //   .then(async (data) => {
    //     const channel = await client.channels.fetch("762593272199249931");
    //     await channel.send({ files: [asset`/images/WotImage.png`] });
    //   });
    await wait(10000);
    await mainScene.filter("WOTFreeze")?.setEnabled(false);
    mainWrapped.remove();
    WOTscene.remove();
    UnmuteMic(obs);
    await wait(1000);
    redemptionEnded("wot");
  },
});
