import { Switch } from "@headlessui/react";
import { Alignment, MonitoringType, Scene } from "@sceneify/core";
import {
  ColorSource,
  GDIPlusTextSource,
  ImageSource,
  MediaSource,
} from "@sceneify/sources";
import { ScrollFilter } from "@sceneify/filters";

import { Easing, keyframe, animate } from "@sceneify/animation";
import { localDB } from "~/data/jsondb";
import { redemptionsStore } from "~/data/stores";
import { asset, wait } from "~/utils";
import {
  DynamicMask,
  RainbowShader,
  SDFEffects,
  ShakeShader,
  ShineShader,
} from "../filters";
import { Fireworks, HypeTrainScene, mainScene, MainWrapper } from "../Main";
import { objectMaterial } from "../physics/materials";
import { GenericSound } from "../redemptions";

let HTSONG = new MediaSource({
  name: "Leve1",
  settings: {
    local_file: asset`sounds/Level1.mp3`,
  },
});

export async function hypeTrainBegin() {
  let obs = mainScene.obs;

  await mainScene.createItem("L1", {
    source: HTSONG,
  });

  TrainEnd = 0;

  HTSONG.setAudioMonitorType(MonitoringType.MonitorAndOutput);

  await mainScene.item("hypetrain")!.source.addFilter(
    "SHAKE",
    new ShakeShader({
      name: "SHAKE",
      enabled: false,
      settings: {
        Angle_Degrees: 0.5,
        override_entire_effect: true,
        Axis_X: 0,
        Axis_Z: 0,
        Axis_Y: 0.3,
        Rotate_Pixels: false,
        Rotate_Transform: true,
        speed_percent: 5000,
      },
    })
  );

  await mainScene.item("hypetrain")!.source.addFilter(
    "Glow",
    new SDFEffects({
      name: "Glow",
      settings: {
        "Filter.SDFEffects.Glow.Outer.Color": 0xff00baff,
        "Filter.SDFEffects.Glow.Outer.Sharpness": 2,
        "Filter.SDFEffects.Glow.Outer.Width": 16,
        "Filter.SDFEffects.Glow.Outer": true,
        "Filter.SDFEffects.SDF.Scale": 11.14,
      },
    })
  );

  await mainScene.item("hypetrain")!.source.addFilter(
    "RAINBOW",
    new RainbowShader({
      name: "RAINBOW",
      settings: {
        Replace_Image_Color: true,
        Apply_To_Image: true,
        Alpha_Percentage: 30,
      },
    })
  );

  await mainScene
    .item("hypetrain")!
    .source.filter("RAINBOW")!
    .setEnabled(false);
  TrainRunning = 1;
  animate({
    subjects: {
      hypetrain: mainScene.item("hypetrain")!,
    },
    keyframes: {
      hypetrain: {
        positionY: {
          0: -100,
          10000: keyframe(540, Easing.Out),
        },
      },
    },
  });
  TrainScene = await new Scene({
    name: "TrainScene",
    items: {
      VoidSource: {
        source: new ColorSource({
          name: "bigblacksource",
          settings: {
            width: 1920,
            height: 1080,
            color: 0x00000000,
          },
        }),
        enabled: false,
      },
    },
  }).create(obs);

  CHOOCHOO = await mainScene.createItem("TrainScene", {
    source: TrainScene,
    positionX: 960,
    positionY: 540,
    alignment: Alignment.Center,
  });

  await CHOOCHOO.source.addFilter(
    "Glow",
    new SDFEffects({
      name: "Glow",
      settings: {
        "Filter.SDFEffects.Glow.Outer.Color": 0xff00baff,
        "Filter.SDFEffects.Glow.Outer.Sharpness": 2,
        "Filter.SDFEffects.Glow.Outer.Width": 16,
        "Filter.SDFEffects.Glow.Outer": true,
        "Filter.SDFEffects.Glow.Inner": true,
        "Filter.SDFEffects.Glow.Inner.Color": 0xff00baff,
        "Filter.SDFEffects.Glow.Inner.Sharpness": 0,
        "Filter.SDFEffects.Glow.Inner.Width": 2,
        "Filter.SDFEffects.SDF.Scale": 55,
      } as any,
    })
  );

  await CHOOCHOO.source.addFilter(
    "RAINBOW",
    new RainbowShader({
      name: "RAINBOW",
      settings: {
        Replace_Image_Color: true,
        Apply_To_Image: true,
        Alpha_Percentage: 50,
      },
      enabled: false,
    })
  );

  await wait(13000);
  hypeTrainTrain(Loop);
}

let prevLevel = 1;
let FireWork: any;

const colours = {
  1: { Color: 0xff00baff, size: 55, speed: 20 },
  2: { Color: 0xff0000ff, size: 32.54, speed: 16 },
  3: { Color: 0xffd400ff, size: 24.54, speed: 13 },
  4: { Color: 0xffff0000, size: 10.25, speed: 10 },
  5: { Color: 0xffffe400, size: 10.52, speed: 8 },
} as any;

const levels = {
  1: { min: 1752, max: 1459 },
  2: { min: 1428, max: 1135 },
  3: { min: 1104, max: 811 },
  4: { min: 780, max: 487 },
  5: { min: 456, max: 163 },
};

export async function hypeTrainProgress(
  Level: number,
  progress: number,
  goal: number
) {
  let obs = mainScene.obs;
  await wait(1000);
  let Percentage = progress / goal;
  let width = (levels as any)[Level].min - Percentage * 293;
  Loop = colours[Level].speed * 1000;
  if (prevLevel != Level) {
    switch (Level) {
      case 1:
        redemptionsStore.toggleRedemption("explosion", true);
        break;
      case 2:
        break;
      case 3:
        break;
      case 4:
        break;
      case 5:
        redemptionsStore.toggleRedemption("thanos snap", true);
        break;
    }
    GenericSound("G&A", asset`sounds/GAA.mp3`, 0, true, 3);
    animate({
      subjects: {
        Main: MainWrapper.item("Main")!.source.filter("HTCC")!,
      },
      keyframes: {
        Main: {
          brightness: {
            0: 0,
            300: 1,
            600: 0,
          },
        },
      },
    });
  }
  prevLevel = Level;

  await wait(300);

  mainScene.item("hypetrain")!.source.filter("Glow")!.setSettings({
    "Filter.SDFEffects.Glow.Outer.Color": colours[Level].Color,
  });

  CHOOCHOO.source.filter("Glow")!.setSettings({
    "Filter.SDFEffects.Glow.Outer.Color": colours[Level].Color,
    "Filter.SDFEffects.SDF.Scale": colours[Level].size,
    "Filter.SDFEffects.Glow.Inner.Color": colours[Level].Color,
  });

  switch (Level) {
    case 1:
      break;
    case 2:
      break;
    case 3:
      await mainScene
        .item("hypetrain")!
        .source.filter("SHAKE")!
        .setEnabled(true);
      await mainScene.filter("BLOOM")!.setEnabled(true);
      await mainScene.filter("BLOOM")!.setSettings({
        ampFactor: 0.5,
      });
      break;
    case 4:
      await mainScene
        .item("hypetrain")!
        .source.filter("SHAKE")!
        .setEnabled(true);
      await mainScene.filter("BLOOM")!.setEnabled(true);
      await mainScene.filter("BLOOM")!.setSettings({
        ampFactor: 1,
      });
      await mainScene.filter("HTShakeY")!.setEnabled(true);
      await mainScene.filter("HTShakeX")!.setEnabled(true);
      await mainScene.item("hypetrain")!.source.filter("SHAKE")!.setSettings({
        Angle_Degrees: 0.8,
        Axis_Y: 0.5,
        speed_percent: 5000,
      });
      await mainScene.filter("HTShakeX")!.setSettings({
        Angle_Degrees: 0.3,
        Axis_X: 0.2,
        speed_percent: 5000,
      });
      await mainScene.filter("HTShakeY")!.setSettings({
        Angle_Degrees: 0.4,
        Axis_Y: 0.3,
        speed_percent: 4000,
      });
      break;
    case 5:
      await mainScene.filter("BLOOM")!.setEnabled(true);
      await mainScene.filter("BLOOM")!.setSettings({
        ampFactor: 1.5,
      });
      await mainScene.filter("HTShakeY")!.setEnabled(true);
      await mainScene.filter("HTShakeX")!.setEnabled(true);
      await mainScene.item("hypetrain")!.source.filter("SHAKE")!.setSettings({
        Angle_Degrees: 1,
        Axis_Y: 0.8,
        speed_percent: 8000,
      });
      await mainScene.filter("HTShakeX")!.setSettings({
        Angle_Degrees: 0.7,
        Axis_X: 0.5,
        speed_percent: 9000,
      });
      await mainScene.filter("HTShakeY")!.setSettings({
        Angle_Degrees: 0.7,
        Axis_Y: 0.6,
        speed_percent: 8000,
      });
      await mainScene
        .item("hypetrain")!
        .source.filter("SHAKE")!
        .setEnabled(true);
      await mainScene.item("hypetrain")!.source.filter("SHAKE")!.setSettings({
        Angle_Degrees: 0.6,
        Axis_Y: 0.3,
        speed_percent: 7000,
      });
      if (Percentage > 1) {
        let FireWork = await mainScene.createItem("Fireworks", {
          source: Fireworks,
        });
        FireWork.source.setAudioMonitorType(MonitoringType.MonitorAndOutput);
        GenericSound("G&A", asset`sounds/GAA.mp3`);
        animate({
          subjects: {
            Main: MainWrapper.item("Main")!.source.filter("HTCC")!,
          },
          keyframes: {
            Main: {
              brightness: {
                0: 0,
                300: 1,
                600: 0,
              },
            },
          },
        });
        await wait(300);
        await mainScene.filter("BLOOM")!.setSettings({
          ampFactor: 2.2,
        });
        await mainScene.filter("HTShakeX")!.setSettings({
          Angle_Degrees: 1,
          Axis_Y: 1.3,
          speed_percent: 15000,
        });
        await mainScene.filter("HTShakeY")!.setSettings({
          Angle_Degrees: 1,
          Axis_X: 1.2,
          speed_percent: 15000,
        });
        mainScene.filter("BLOOM")!.setEnabled(true);
        mainScene.filter("HTShakeY")!.setEnabled(true);
        mainScene.filter("HTShakeX")!.setEnabled(true);
        mainScene.filter("VHSHT")!.setEnabled(true);
        await mainScene.item("hypetrain")!.source.filter("SHAKE")!.setSettings({
          Angle_Degrees: 0.8,
          Axis_Y: 0.5,
          speed_percent: 10000,
        });
        await CHOOCHOO.source.filter("RAINBOW")!.setVisible(true);
        await mainScene
          .item("hypetrain")!
          .source.filter("RAINBOW")!
          .setEnabled(true);
      }
      break;
  }

  animate({
    subjects: {
      bar: HypeTrainScene.item("bigProgressBar")!,
    },
    keyframes: {
      bar: {
        cropRight: {
          1000: width,
        },
      },
    },
  });
  for (let i = 0; i <= 100; i++) {
    await wait(10);
    for (const [level, range] of Object.entries(levels)) {
      HypeTrainScene.item(`progressBar${level}`)!.setEnabled(
        range.max > HypeTrainScene.item("bigProgressBar")!.transform.cropRight
      );
    }
  }
}

export async function hypeTrainEnd() {
  let obs = mainScene.obs;
  try {
    FireWork.remove();
  } catch (err) {}
  animate({
    subjects: {
      Main: MainWrapper.item("Main")!.source.filter("HTCC")!,
    },
    keyframes: {
      Main: {
        brightness: {
          0: 0,
          300: 1,
          600: 0,
        },
      },
    },
  });
  await wait(300);
  await mainScene.filter("HTShakeY")!.setEnabled(false);
  await mainScene.filter("HTShakeX")!.setEnabled(false);
  await CHOOCHOO.source.filter("RAINBOW")!.setEnabled(false);
  await mainScene
    .item("hypetrain")!
    .source.filter("RAINBOW")!
    .setEnabled(false);
  mainScene.filter("BLOOM")!.setEnabled(false);
  mainScene.filter("VHSHT")!.setEnabled(false);
  CHOOCHOO.source.filter("Glow")!.setEnabled(false);
  await mainScene.item("hypetrain")!.source.filter("Glow")!.setEnabled(false);
  for (let i = 0; i > -60; i--) {
    HTSONG.setVolume({ db: i });
    await wait(50);
  }
  HTSONG.remove();
  animate({
    subjects: {
      hypetrain: mainScene.item("hypetrain")!,
    },
    keyframes: {
      hypetrain: {
        positionY: {
          1000: keyframe(450, Easing.In),
        },
      },
    },
  });
  TrainRunning--;
  TrainEnd = 1;
  animate({
    subjects: {
      hypetrain: mainScene.item("hypetrain")!,
    },
    keyframes: {
      hypetrain: {
        positionY: {
          1000: keyframe(450, Easing.In),
        },
      },
    },
  });
}

let TrainEnd = 0;
let TrainRunning = 0;
let TrainScene: any;
let CHOOCHOO: any;

let Loop = 20000;

export async function hypeTrainTrain(Offset: number) {
  let LoopOffset = Offset;
  if (TrainRunning === 0) return;
  let users = localDB.getData("/store/hypetrainusers");
  const trainEngine = new MediaSource({
    name: "engine",
    settings: {
      local_file: asset`hypetrain/HYPETRAINENGINE.mov`,
      looping: true,
    } as any,
  });

  let engine = await TrainScene.createItem("Engine", {
    source: trainEngine,
    positionX: -1000,
    positionY: 809,
    alignment: Alignment.Center,
  });

  animate({
    subjects: {
      Engine: TrainScene.item("Engine"),
    },
    keyframes: {
      Engine: {
        positionX: {
          0: -400,
          [LoopOffset + LoopOffset / 7.8]: keyframe(2220, Easing.Linear),
        },
      },
    },
  });

  setTimeout(() => {
    engine.remove();
  }, LoopOffset + LoopOffset / 7.8 + 200);

  await wait(LoopOffset / 27);
  for (let i = 0; i < users.length; i++) {
    TrainRunning++;
    await wait(LoopOffset / 13.3);
    let wagon = await TrainScene.createItem(`wagon${users[i]}`, {
      source: new ImageSource({
        name: `wagon${users[i]}`,
        settings: {
          file: asset`hypetrain/HYPETRAINWAGON.png`,
        },
      }),
      positionX: -100,
      positionY: 1007,
      alignment: Alignment.Center,
    });

    let name = await TrainScene.createItem(`wagon${users[i]} Name`, {
      source: new GDIPlusTextSource({
        name: `wagon${users[i]} Name`,
        settings: {
          text: users[i],
          font: {
            face: "Comic Sans MS",
            size: 40,
          },
          color: 0xffffffff,
          align: "center",
          valign: "center",
        } as any,
      }),
      positionX: -200,
      positionY: 1000,
      alignment: Alignment.Center,
      enabled: false,
    });

    setTimeout(async () => {
      if (name.transform.sourceWidth > 150) {
        name.source.setSettings({
          text: users[i] + " ",
        });
        await name.setTransform({
          cropRight: (name.transform.sourceWidth - 130) / 2,
          cropLeft: (name.transform.sourceWidth - 130) / 2,
        });

        await name.source.addFilter(
          `Scrolling ${i}`,
          new ScrollFilter({
            name: `Scrolling ${i}`,
            settings: {
              loop: true,
              speed_x: 30,
            },
          })
        );
      }
      name.setEnabled(true);
    }, 50);

    setTimeout(async () => {
      await wagon.remove();
      await name.remove();
      if (TrainRunning > 0) {
        TrainRunning--;
      }
      if (TrainRunning === 1 && TrainEnd === 0) hypeTrainTrain(Loop);
      if (TrainRunning === 0) await TrainScene.remove();
    }, LoopOffset + 1000);

    animate({
      subjects: {
        currentWagon: TrainScene.item(`wagon${users[i]}`),
        WagonName: TrainScene.item(`wagon${users[i]} Name`),
      },
      keyframes: {
        currentWagon: {
          positionX: {
            0: -200,
            [LoopOffset]: keyframe(2120, Easing.Linear),
          },
        },
        WagonName: {
          positionX: {
            0: -200,
            [LoopOffset]: keyframe(2120, Easing.Linear),
          },
        },
      },
    });
  }
}
