import { createRedemptionHandler, redemptionEnded } from "./base";
import { Fireworks, mainScene, obs } from "~/obs/Main";
import { Alignment, MonitoringType, Scene, SceneItem } from "@sceneify/core";
import { ChromaKeyFilter, ColorKeyFilter } from "@sceneify/filters";
import { BrowserSource, ImageSource, MediaSource } from "@sceneify/sources";
import { v4 as uuidv4 } from "uuid";
import { asset, wait } from "~/utils";
import Window from "~/obs/Window";
import { cameraVideoIcon, MineSweeperIcon } from "~/obs/sprites";
import { TMIClient } from "~/data/services/emotes";
import { getBody, unregisterPhysicsItem } from "~/obs/physics";
import { GenericVideo } from "~/obs/redemptions";
import { FakeEvent, redemptionsStore } from "~/data/stores";

createRedemptionHandler({
  event: "minesweeper",
  handler: async () => {
    let minebrowser = new BrowserSource({
      name: "MinesweeperGame",
      settings: {
        is_local_file: true,
        height: 1080,
        width: 1920,
        shutdown: true,
        restart_when_active: true,
        local_file: asset`mine/minesweeper/minesweeper.html`,
      } as any,
    });

    const Minesweeper = await new Scene({
      name: "Minesweeper",
      items: {
        minesweeperBack: {
          source: new ImageSource({
            name: "minesweeperBack",
            settings: {
              file: asset`mine/minesweeper.png`,
            },
          }),
          positionX: 960,
          positionY: 540,
          alignment: Alignment.Center,
        },
        minesweepermainBoard: {
          source: minebrowser,
          positionX: 960,
          positionY: 575,
          alignment: Alignment.Center,
          scaleX: 0.565,
          scaleY: 0.565,
          cropBottom: 429,
          cropLeft: 0,
          cropRight: 1400,
          cropTop: 171,
        },
        minesweepertimer: {
          source: minebrowser,
          positionX: 849,
          positionY: 400,
          scaleX: 0.565,
          scaleY: 0.565,
          cropBottom: 956,
          cropLeft: 244,
          cropRight: 1573,
          cropTop: 74,
        },
        minesweepercounter: {
          source: minebrowser,
          positionX: 1039,
          positionY: 400,
          scaleX: 0.565,
          scaleY: 0.565,
          cropBottom: 798,
          cropLeft: 674,
          cropRight: 1170,
          cropTop: 229,
        },
      },
    }).create(obs);

    const minesweeperWindow = await new Window({
      name: "Minesweeper",
      contentScene: Minesweeper,
      boundsItem: "minesweeperBack",
      scale: 1,
      icon: MineSweeperIcon,
    }).create(obs);

    const MSINMAIN = await mainScene.createItem("minesweeperGame", {
      source: minesweeperWindow,
      positionX: 960,
      positionY: -400,
      alignment: Alignment.Center,
    });

    let timeout = 120;

    setTimeout(() => {
      if (timeout > 0) {
        timeout--;
      } else {
        MSINMAIN.delete();
        TMIClient.removeListener("message", listener);
        redemptionEnded("minesweeper");
      }
    }, 1000);

    const listener = async (
      channel: any,
      tags: any,
      message: any,
      self: any
    ) => {
      if (message.includes("!dig") || message.includes("!flag")) {
        timeout = 120;
      }
      if (tags.username === "ocefam") {
        if (message.includes("hit a mine and died!")) {
          GenericVideo(
            "MSExplosion",
            mainScene,
            asset`Mine/Explode.mov`,
            false,
            MSINMAIN.transform.positionX,
            MSINMAIN.transform.positionY - 200,
            0.8
          );
          TMIClient.removeListener("message", listener);
          await wait(1600);
          MSINMAIN.delete();
          FakeEvent("yeet");
          minesweeperWindow.remove();
          await wait(2000);
          redemptionEnded("minesweeper");
        }
        if (message.includes("Game has been completed in")) {
          redemptionsStore.toggleRedemption("explosion", true);
          TMIClient.removeListener("message", listener);
          let FW = await mainScene.createItem("Fireworks", {
            source: Fireworks,
          });
          FW.source.setAudioMonitorType(MonitoringType.MonitorAndOutput);
          setTimeout(() => {
            redemptionsStore.toggleRedemption("explosion", false);
            FW.remove();
          }, 30000);
          MSINMAIN.delete();
          minesweeperWindow.remove();
          setTimeout(() => {
            redemptionEnded("minesweeper");
          }, 20000);
        }
      }
    };

    TMIClient.on("message", listener);
  },
});
