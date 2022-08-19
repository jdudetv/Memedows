import { Alignment, MonitoringType, OBS } from "@sceneify/core";
import { MediaSource } from "@sceneify/sources";
import { animate } from "@sceneify/animation";
import { localDB } from "~/data/jsondb";
import { wait } from "~/utils";
import { mainScene } from "./Main";
import { StartingScene, MonitorScene, StartingWrap } from "./StartingScene";

export async function startup() {
  let Countdown = 600; //countdown timer in seconds

  setInterval(() => {
    if (Countdown === 0) return;
    Countdown--;
    let minutes = Math.floor(Countdown / 60).toString();
    let seconds = (Countdown - parseInt(minutes) * 60).toString();
    if (minutes === "0") {
      minutes = "";
    }
    if (seconds.length === 1) {
      seconds = "0" + seconds;
    }
    StartingScene.item("deskClockhours").source.setSettings({
      // text: desk.getHours() + " " + desk.getMinutes(),
      text: minutes,
    });
    StartingScene.item("deskClockminutes").source.setSettings({
      // text: desk.getHours() + " " + desk.getMinutes(),
      text: seconds,
    });
  }, 1000); // loop to count down

  //Turning on all the video sources and audio srouces at the same time.
  await wait(Countdown * 1000);
  MonitorScene.item("Screen").setEnabled(true);
  await wait(1000); // delay added so bios shows first
  MonitorScene.item("Loading").setEnabled(true);
  MonitorScene.item("ScreenVisual").setEnabled(true);

  MonitorScene.item("ChatStarting").setEnabled(false);

  MonitorScene.item("diskSpinUp").setEnabled(true);

  setTimeout(() => {
    MonitorScene.item("Screen").setEnabled(false);
  }, 7000);

  //Zoom animation.
  animate({
    subjects: {
      StartingScene: StartingWrap.item("StartingScene")!,
      MonitorScene: StartingWrap.item("MonitorScene")!,
    },
    keyframes: {
      StartingScene: {
        positionX: {
          10000: 1430,
        },
        positionY: {
          10000: 200,
        },
        scaleX: {
          10000: 5.1,
        },
        scaleY: {
          10000: 5.1,
        },
      },
      MonitorScene: {
        positionX: {
          10000: 960,
        },
        positionY: {
          10000: 540,
        },
        scaleX: {
          10000: 1,
        },
        scaleY: {
          10000: 1,
        },
      },
    },
  });
  //Time untill the audio starts fading out.
  await wait(10000);
  for (let i = 0; i > -60; i--) {
    await wait(100);
    await StartingScene.item("OfficeSound").source.setVolume({
      db: i,
    });
  }
  //Time that loading sccreen is shown for.
  await animate({
    subjects: {
      MonitorCRT: MonitorScene.filter("CRT"),
      MonitorScanline: MonitorScene.filter("SCANLINE"),
    },
    keyframes: {
      MonitorCRT: {
        _0_strength: {
          30000: 0,
        },
        _2_feathering: {
          30000: 0,
        },
      },
      MonitorScanline: {
        _0_Strength: {
          30000: 0,
        },
        "_1_Intensity[0]": {
          30000: 100,
        },
      },
    },
  });
  await wait(5000);

  const Login = await mainScene.createItem("Login", {
    source: new MediaSource({
      name: "Loginanim",
      settings: {
        local_file: `L:/Streaming/Windows xp/LoginAnimation.mov`,
        looping: false,
        clear_on_media_end: true,
      },
      audioMonitorType: MonitoringType.MonitorAndOutput,
    }),
    positionX: 960,
    positionY: 540,
    alignment: Alignment.Center,
    scaleX: 1,
    scaleY: 1,
    enabled: true,
  });

  //Removal of loading screen from underneath.
  await wait(1000);
  MonitorScene.item("Loading").setEnabled(false);
  MonitorScene.item("ScreenVisual").setEnabled(false);
  StartingWrap.item("TheVoid").setEnabled(false);
  //waiting untill login animation has finished to delete the layer.
  await wait(35000);
  Login.remove();
}
