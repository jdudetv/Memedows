import { ColorSource, ImageSource } from "@sceneify/sources";
import { fstat, readdir, readdirSync } from "fs";
import { cameraScene, mainScene, MainWrapper } from "~/obs/Main";
import { createRedemptionHandler, redemptionEnded } from "./base";
import { asset, assetString } from "~/utils";
import {
  getBody,
  registerPhysicsCircle,
  registerPhysicsItem,
  unregisterPhysicsItem,
} from "~/obs/physics";
import { Alignment } from "@sceneify/core";
import { v4 } from "uuid";
import { animate, wait } from "@sceneify/animation";
import { GenericSound } from "~/obs/redemptions";
import { localDB } from "~/data/jsondb";
import { GenericVideo } from "~/obs/redemptions";
import {
  checkSubbed,
  completeRedemption,
  refundRedemption,
} from "~/data/services/twitchApi";

let ShotTimer = 0;
let baseHealth = 5000;
let Phase = localDB.getData("/store/phase");
let FullHealth = baseHealth * Number(Phase);

const TiersList: Record<number, number> = {
  1: 5,
  2: 10,
  3: 25,
  4: 50,
  5: 100,
  6: 200,
  7: 400,
  8: 800,
};

const subList: Record<number, number> = {
  1000: 5,
  2000: 10,
  3000: 25,
};

createRedemptionHandler({
  event: "shoot",
  handler: async (data) => {
    redemptionEnded("shoot");
    // console.log(data.fake);
    // let user;
    // try {
    //   user = localDB.getData(`/store/shootcooldown/${data.userName}/`);
    // } catch (error) {
    //   localDB.push(`/store/shootcooldown/${data.userName}/`, Date.now());
    //   user = 0;
    // }
    // if (user > Date.now() - 120000 && data.fake !== true) {
    //   if (!data.fake) refundRedemption(data.id, data.reward.id);
    //   redemptionEnded("shoot");
    //   return;
    // } else {
    //   localDB.push(`/store/shootcooldown/${data.userName}/`, Date.now());
    //   completeRedemption(data.id, data.reward.id);
    // }
    // let SubMod = await checkSubbed(data.userId);
    // let kofiSub;
    // try {
    //   kofiSub = localDB.getData(
    //     `/store/Tiers/${data.userName.toLowerCase()}/tier`
    //   );
    // } catch (error) {}
    // // console.log(kofiSub);
    // // console.log(SubMod.data[0].tier);
    // let Health = localDB.getData("/store/cam/health");
    // let shots = 0;
    // let takenShots = 0;
    // if (data.input === "") {
    //   shots = 1;
    // } else {
    //   shots = Number(data.input);
    // }
    // if (kofiSub !== undefined) {
    //   shots += TiersList[kofiSub];
    // }
    // if (SubMod.data.length === 1) {
    //   shots += subList[SubMod.data[0].tier];
    // }
    // const loop = async () => {
    //   if (mainScene.item("cameraWindow").transform.positionY < 100) {
    //     setTimeout(() => {
    //       loop();
    //     }, 50);
    //   } else {
    //     takenShots++;
    //     if (ShotTimer > 0 && ShotTimer < 10) {
    //       ShotTimer = 10;
    //     } else if (ShotTimer === 0) {
    //       ShotTimer = 10;
    //     }
    //     let Rand = v4();
    //     let Percent = Health / FullHealth;
    //     if (Health != 0) Health--;
    //     if (
    //       Percent < 0.8 &&
    //       cameraScene.item("camera").source.filter("pixelate").enabled === false
    //     ) {
    //       cameraScene.item("camera").source.filter("pixelate").setEnabled(true);
    //     }
    //     if (Percent < 0.8) {
    //       cameraScene
    //         .item("camera")
    //         .source.filter("pixelate")
    //         .setSettings({ PixelScale: Percent * 1024 });
    //     }
    //     localDB.push("/store/cam/health", Health);
    //     cameraScene
    //       .item("health")
    //       .source.setSettings({ width: (Health / FullHealth) * 1920 });
    //     if (Health == 0) {
    //       console.log("!YOU HAVE DIED!");
    //       takenShots = shots;
    //       KillCam();
    //     }
    //     let angle = 0;
    //     if (mainScene.item("cameraWindow").transform.positionX < 960) {
    //       angle =
    //         90 -
    //         (Math.atan2(
    //           mainScene.item("cameraWindow").transform.positionY,
    //           960 - mainScene.item("cameraWindow").transform.positionX
    //         ) *
    //           180) /
    //           Math.PI;
    //     } else {
    //       angle = -(
    //         90 -
    //         (Math.atan2(
    //           mainScene.item("cameraWindow").transform.positionY,
    //           mainScene.item("cameraWindow").transform.positionX - 960
    //         ) *
    //           180) /
    //           Math.PI
    //       );
    //     }

    //     readdir("L:/Streaming/assets/shoot", async (err, files) => {
    //       let image = files[Math.floor(Math.random() * files.length)];
    //       const bullet = await mainScene.createItem(image + Rand, {
    //         source: new ImageSource({
    //           name: image + Rand,
    //           settings: {
    //             file: assetString(`shoot/${image}`),
    //           },
    //         }),
    //         positionX: 960,
    //         positionY: 20,
    //         scaleX: 0.5,
    //         scaleY: 0.5,
    //         alignment: Alignment.Center,
    //       });
    //       let yVol = ((90 - Math.abs(angle)) / 90) * 10000;
    //       let xVol = (angle / 90) * 10000;
    //       registerPhysicsCircle(bullet);
    //       const body = getBody(bullet);
    //       if (body === undefined) return;
    //       body.mass = 500;
    //       body.velocity = [-xVol, yVol];
    //       GenericSound(
    //         `gun${v4()}`,
    //         `L:/Streaming/assets/sounds/gun.mp3`,
    //         -50,
    //         true
    //       );
    //       setTimeout(async () => {
    //         unregisterPhysicsItem(bullet);
    //         await wait(100);
    //         bullet.remove();
    //       }, 125);
    //     });
    //     setTimeout(() => {
    //       if (takenShots < shots) loop();
    //     }, 50);
    //   }
    //   if (takenShots === shots && Health !== 0) {
    //     cameraScene
    //       .item("Text")
    //       .source.setSettings({ text: Health.toString() });
    //     redemptionEnded("shoot");
    //   }
    // };
    // await loop();
  },
});

function HealthBarFade() {
  animate({
    subjects: {
      bar: cameraScene.item("health").source.filter("Fade"),
    },
    keyframes: {
      bar: {
        opacity: {
          250:
            cameraScene.item("health").source.filter("Fade").settings.opacity ==
            1
              ? 0
              : 1,
        },
      },
    },
  });
}

// setInterval(() => {
//   if (
//     ShotTimer === 10 &&
//     cameraScene.item("health").source.filter("Fade").settings.opacity == 0
//   ) {
//     HealthBarFade();
//   }
//   if (ShotTimer !== 0) ShotTimer--;
//   if (
//     ShotTimer === 0 &&
//     cameraScene.item("health").source.filter("Fade").settings.opacity == 1
//   ) {
//     HealthBarFade();
//   }
// }, 1000);

export async function KillCam() {
  Phase++;
  localDB.push("/store/phase", Phase);
  GenericVideo(
    "MSExplosion",
    mainScene,
    asset`Mine/Explode.mp4`,
    false,
    mainScene.item("cameraWindow").transform.positionX,
    mainScene.item("cameraWindow").transform.positionY,
    2,
    true
  );
  await wait(500);
  const body = getBody(mainScene.item("cameraWindow"))!;
  body.velocity = [0, -5000];

  setTimeout(() => {
    let FullHealth = Number(localDB.getData("/store/phase")) * baseHealth;
    localDB.push("/store/cam/health", FullHealth);
    cameraScene
      .item("Text")
      .source.setSettings({ text: FullHealth.toString() });
    cameraScene.item("health").source.setSettings({ width: 1920 });
    cameraScene
      .item("camera")
      .source.filter("pixelate")
      .setSettings({ PixelScale: 1024 });
    setTimeout(() => {
      redemptionEnded("shoot");
    }, 10000);
  }, 500);
}
