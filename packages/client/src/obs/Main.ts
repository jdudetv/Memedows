import { OBS, Alignment, Scene, MonitoringType, Filter } from "@sceneify/core";
import {
  BrowserSource,
  ImageSource,
  DisplayCaptureSource,
  ColorSource,
  VideoCaptureSource,
  GDIPlusTextSource,
} from "@sceneify/sources";
import {
  CompressorFilter,
  ColorCorrectionFilter,
  ColorKeyFilter,
  ColorKeyColorType,
  ChromaKeyFilter,
  ChromaKeyColorType,
  MaskBlendType,
  ImageMaskBlendFilter,
  ScrollFilter,
} from "@sceneify/filters";
import { animate, Easing, setDefaultEasing } from "@sceneify/animation";

import { asset, wait } from "~/utils";
import {
  registerPhysicsItem,
  setupPhysics,
  startPhysics,
  unregisterPhysicsItem,
} from "./physics";
import {
  cameraVideoIcon,
  gameIcon,
  MineSweeperIcon,
  musicIcon,
  pollIcon,
  webIcon,
} from "./sprites";

import { Taskbar } from "./Taskbar";
import { MotionBlurTick, registerMotionBlurItem } from "./motionBlur";
import Window from "./Window";
import { SSPSource } from "./sources/SSP";
import {
  BloomShader,
  Blur,
  CartoonShader,
  CRTShader,
  DynamicMask,
  FreezeFrame,
  PixelateShader,
  RainbowShader,
  ScanlineShader,
  SDFEffects,
  ShakeShader,
  ShineShader,
  ThreeDTransform,
  VHSSHader,
} from "./filters";
import { resumeRedemptionQueue } from "~/data/handlers/redemptions/base";
import { localDB } from "~/data/jsondb";
import { MonitorScene, StartingScene, StartingWrap } from "./StartingScene";
import { eventList, StartMenu } from "./startMenu";
import { Main } from "electron";
import { convert } from "~/utils/keyframes";
import { GetID } from "~/data/services/twitchApi";
import { setupBits, startBitsPhysics } from "./Physicsbits";
import { allowedNodeEnvironmentFlags } from "process";
import { setupPlinko, startPlinkoPhysics } from "./bitsPlinko";
import { ProgressBar } from "./sources/progress";
import fs from "fs";
import { Visualiser } from "./sources/visualiser";
import { GenericSound } from "./redemptions";
import { usersStore } from "~/data/stores";
import TuyAPI from "tuyapi";
import hslToHex from "hsl-to-hex";
import { hsv, hsl, hex } from "color-convert";
import { HEXtoLED, HSVtoLED } from "./physics/utils";

export const obs = new OBS();

// const device = new TuyAPI({
//   id: "bfe40f5f188263d0c8tuvf",
//   key: "b771427902cf03f0"
// });

// let stateHasChanged = false;

// device.find().then(() => {
//   device.connect();
// })

// device.on('connected', () => {
//   console.log('Connected to device!');
// });

// device.on('disconnected', () => {
//   console.log('Disconnected from device.');
// });

// device.on('error', error => {
//   console.log('Error!', error);
// });

// let flashes = 0;
// let toggle = 0;

// device.on("dp-refresh", async (data) =>{
//   await wait(500);
//   console.log(data);
//   await wait(1000);
//   // device.set({dps: 21, set: "colour"});
//   // if(flashes < 6) flash();
// });

// // function flash (){
// //     if(toggle == 1){
// //       device.set({dps: 24, set: HEXtoLED("#FF0000")});
// //       toggle = 0;
// //     } else {
// //       device.set({dps: 24, set: HEXtoLED("#0000FF")});
// //       toggle = 1;
// //     }
// //     flashes++;
// // }

// device.on('data', data => {
//   console.log('Data from device:', data);

//   // Set default property to opposite
//   if (!stateHasChanged) {
//     // device.set({dps: 24, set: HEXtoLED("#FF0000")});
//     device.set({dps: 21, set: "scene"});

//     // Otherwise we'll be stuck in an endless
//     // loop of toggling the state.
//     stateHasChanged = true;
//   }
// });

// // Disconnect after 10 seconds

let HealthText = localDB.getData("/store/cam/health");
console.log(HealthText);

setDefaultEasing(Easing.InOut);

export const taskbar = new Taskbar();

export const bitsContainer = new Scene({
  name: "BitsContainer",
  items: {},
});

export const pixelScene = new Scene({
  name: "PixelScene",
  items: {},
});

export const MusicPlayerScene = new Scene({
  name: "MusicPlayerScene",
  items: {
    // playtime: {
    //   source: new ProgressBar({
    //     name: "playtime",
    //     settings: {
    //       use_bg: true,
    //       bg: 4281084972,
    //       fg: 4294949632,
    //       cx: 495,
    //       cy: 50,
    //     },
    //   }),
    //   positionX: 960,
    //   positionY: 625,
    //   alignment: Alignment.Center,
    // },
    MusicBackground: {
      source: new ImageSource({
        name: "MusicBackground",
        settings: {
          file: asset`images/music.png`,
        },
      }),
      positionX: 960,
      positionY: 540,
      alignment: Alignment.Center,
    },
    TitleofSong: {
      source: new GDIPlusTextSource({
        name: "TitleofSong",
        settings: {
          read_from_file: true,
          color: 0xff000000,
          file: "L:/Streaming/assets/music/song.txt",
          font: {
            size: 25,
          },
          align: "left",
          valign: "top",
        } as any,
        filters: {
          scrolling: new ScrollFilter({
            name: "scrolling",
            settings: {
              loop: true,
              limit_cx: true,
              speed_x: 50,
              cx: 385,
            } as any,
          }),
        },
      }),
      positionX: 742,
      positionY: 407,
      alignment: Alignment.CenterLeft,
    },
    AlbumArtNowPlaying: {
      source: new ImageSource({
        name: "AlbumArtNowPlaying",
        settings: {
          file: asset`music/albumart.png`,
        },
      }),
      positionX: 1120,
      positionY: 519,
      alignment: Alignment.Center,
      scaleX: 0.272,
      scaleY: 0.272,
    },
    // VisualiserNowPlaying: {
    //   source: new Visualiser({
    //     name: "VisualiserNowPlaying",
    //     settings: {
    //       audio_source: "deskAudio",
    //       bar_space: 0,
    //       color: 4294967295,
    //       corner_points: 5,
    //       corner_radius: 0.5,
    //       detail: 135,
    //       falloff: 0.95,
    //       filter_mode: 2,
    //       filter_strength: 1.3,
    //       gravity: 0.73,
    //       height: 690,
    //       log_freq_scale: true,
    //       log_freq_scale_hpf_curve: 100,
    //       log_freq_scale_quality: 0,
    //       log_freq_scale_start: 67.4,
    //       log_freq_scale_use_hpf: true,
    //       round_corners: false,
    //       scale_boost: 0.001,
    //       scale_size: 0.822,
    //       sgs_passes: 1,
    //       sgs_points: 2,
    //       stereo: false,
    //       use_auto_scale: true,
    //       width: 6,
    //       wire_mode: 0,
    //       wire_thickness: 5,
    //     },
    //     filters: {
    //       RAINBOW: new RainbowShader({
    //         name: "RAINBOW",
    //         settings: {
    //           Apply_To_Image: true,
    //         },
    //       }),
    //     },
    //   }),
    //   positionX: 870,
    //   positionY: 471,
    //   alignment: Alignment.Center,
    //   scaleX: 0.393,
    //   scaleY: 0.393,
    // },
  },
});

export const MusicWindow = new Window({
  name: "MusicWindow",
  contentScene: MusicPlayerScene,
  borders: false,
  boundsItem: "MusicBackground",
  icon: cameraVideoIcon,
  scale: 0.7,
});

export const bitsScene = new Scene({
  name: "BitsScene",
  items: {
    bitsBackground: {
      source: new ColorSource({
        name: "bitsBackground",
        settings: {
          width: 500,
          height: 800,
          color: 0xff000000,
        },
      }),
      positionX: 960,
      positionY: 540,
      alignment: Alignment.Center,
    },
    bitsContainer: {
      source: bitsContainer,
      positionX: 960,
      positionY: 540,
      alignment: Alignment.Center,
    },
    mazeWall: {
      source: new ImageSource({
        name: "mazeWalls",
        settings: {
          file: asset`images/mazewalls.png`,
        },
      }),
      positionX: 960,
      positionY: 540,
      alignment: Alignment.Center,
    },
  },
});

export const plinkoContainer = new Scene({
  name: "plinkoContainer",
  items: {},
});

export const plinkoScene = new Scene({
  name: "plinkoScene",
  items: {
    plinkoBackground: {
      source: new ColorSource({
        name: "plinkoBackground",
        settings: {
          width: 500,
          height: 800,
          color: 0xff000000,
        },
      }),
      positionX: 960,
      positionY: 540,
      alignment: Alignment.Center,
    },
    plinkoWood: {
      source: new ImageSource({
        name: "plinkoWood",
        settings: {
          file: asset`images/plinkoback.png`,
        },
      }),
      positionX: 960,
      positionY: 540,
      scaleX: 0.315,
      scaleY: 0.315,
      rotation: 0,
      cropRight: 1450,
      cropLeft: 1450,
      alignment: Alignment.Center,
    },
    plinkoContainer: {
      source: plinkoContainer,
      positionX: 960,
      positionY: 540,
      alignment: Alignment.Center,
    },
    plinkotexture: {
      source: new ImageSource({
        name: "plinkotexture",
        settings: {
          file: asset`images/plinko.png`,
        },
      }),
      positionX: 960,
      positionY: 540,
      alignment: Alignment.Center,
    },
  },
});

export const HypeTrainScene = new Scene({
  name: "HypeTrainScene",
  items: {
    background: {
      source: new ImageSource({
        name: "HypeTrainBackground",
        settings: {
          file: asset`hypetrain/HYPETRAINBACK.png`,
        },
      }),
      positionX: 960,
      positionY: 0,
      alignment: Alignment.TopCenter,
      rotation: 0,
    },
    bigProgressBar: {
      source: new ImageSource({
        name: "bigProgressBar",
        settings: {
          file: asset`hypetrain/HYPETRAINBIGGREENBAR.png`,
        },
      }),
      cropRight: 1752,
      positionX: 0,
      positionY: 540,
      alignment: Alignment.CenterLeft,
      rotation: 0,
    },
    progressBar1: {
      source: new ImageSource({
        name: "progressBar1",
        settings: {
          file: asset`hypetrain/PROGRESSBARGOLD.png`,
        },
        filters: {
          Shine: new ShineShader({
            name: "Shine",
            enabled: false,
            settings: {
              from_file: true,
              l_tex: asset`images/Gradient.png`,
              speed_percent: 200,
              gradient_percent: 50,
              delay_perecent: 0,
              Apply_To_Alpha_Layer: true,
              ease: false,
              hide: false,
              reverse: true,
              One_Direction: true,
              glitch: false,
            },
          }),
        },
      }),
      positionX: 166,
      positionY: 47.5,
      alignment: Alignment.CenterLeft,
      rotation: 0,
      enabled: false,
    },
    progressBar2: {
      source: new ImageSource({
        name: "progressBar2",
        settings: {
          file: asset`hypetrain/PROGRESSBARGOLD.png`,
        },
        filters: {
          Shine: new ShineShader({
            name: "Shine",
            enabled: false,
            settings: {
              from_file: true,
              l_tex: asset`images/Gradient.png`,
              speed_percent: 200,
              gradient_percent: 50,
              delay_perecent: 0,
              Apply_To_Alpha_Layer: true,
              ease: false,
              hide: false,
              reverse: true,
              One_Direction: true,
              glitch: false,
            },
          }),
        },
      }),
      positionX: 490,
      positionY: 47.5,
      alignment: Alignment.CenterLeft,
      rotation: 0,
      enabled: false,
    },
    progressBar3: {
      source: new ImageSource({
        name: "progressBar3",
        settings: {
          file: asset`hypetrain/PROGRESSBARGOLD.png`,
        },
        filters: {
          Shine: new ShineShader({
            name: "Shine",
            enabled: false,
            settings: {
              from_file: true,
              l_tex: asset`images/Gradient.png`,
              speed_percent: 200,
              gradient_percent: 50,
              delay_perecent: 0,
              Apply_To_Alpha_Layer: true,
              ease: false,
              hide: false,
              reverse: true,
              One_Direction: true,
              glitch: false,
            },
          }),
        },
      }),
      positionX: 814,
      positionY: 47.5,
      alignment: Alignment.CenterLeft,
      rotation: 0,
      enabled: false,
    },
    progressBar4: {
      source: new ImageSource({
        name: "progressBar4",
        settings: {
          file: asset`hypetrain/PROGRESSBARGOLD.png`,
        },
        filters: {
          Shine: new ShineShader({
            name: "Shine",
            enabled: false,
            settings: {
              from_file: true,
              l_tex: asset`images/Gradient.png`,
              speed_percent: 200,
              gradient_percent: 50,
              delay_perecent: 0,
              Apply_To_Alpha_Layer: true,
              ease: false,
              hide: false,
              reverse: true,
              One_Direction: true,
              glitch: false,
            },
          }),
        },
      }),
      positionX: 1138,
      positionY: 47.5,
      alignment: Alignment.CenterLeft,
      enabled: false,
      rotation: 0,
    },
    progressBar5: {
      source: new ImageSource({
        name: "progressBar5",
        settings: {
          file: asset`hypetrain/PROGRESSBARGOLD.png`,
        },
        filters: {
          Shine: new ShineShader({
            name: "Shine",
            enabled: false,
            settings: {
              from_file: true,
              l_tex: asset`images/Gradient.png`,
              speed_percent: 200,
              gradient_percent: 50,
              delay_perecent: 0,
              Apply_To_Alpha_Layer: true,
              ease: false,
              hide: false,
              reverse: true,
              One_Direction: true,
              glitch: false,
            },
          }),
        },
      }),
      positionX: 1462,
      positionY: 47.5,
      alignment: Alignment.CenterLeft,
      rotation: 0,
      enabled: false,
    },
  },
});

export const pollScene = new Scene({
  name: "PollScene",
  items: {
    PollBackground: {
      source: new ImageSource({
        name: "PollBackground",
        settings: {
          file: asset`polls/PollsBackground.png`,
        },
      }),
      positionX: 960,
      positionY: 540,
      alignment: Alignment.Center,
    },
    pollTitle: {
      source: new GDIPlusTextSource({
        name: "pollTitle",
        settings: {
          color: 0xffffffff,
          text: "",
          font: {
            face: "Roboto",
            size: 40,
          },
          outline: true,
          outline_size: 5,
          outline_color: 0xff000000,
          align: "center",
        } as any,
      }),
      positionX: 960,
      positionY: 510,
      alignment: Alignment.Center,
    },
    poll0: {
      source: new ImageSource({
        name: "poll0",
        settings: {
          file: asset`polls/GOLD.png`,
        },
      }),
      positionX: 360,
      positionY: 569,
      alignment: Alignment.CenterLeft,
    },
    poll1: {
      source: new ImageSource({
        name: "poll1",
        settings: {
          file: asset`polls/RED.png`,
        },
      }),
      positionX: 360,
      positionY: 569,
      alignment: Alignment.CenterLeft,
      rotation: 0,
      cropRight: 1201,
    },
    poll2: {
      source: new ImageSource({
        name: "poll2",
        settings: {
          file: asset`polls/BLUE.png`,
        },
      }),
      positionX: 360,
      positionY: 569,
      alignment: Alignment.CenterLeft,
      rotation: 0,
      cropRight: 1201,
    },
    poll3: {
      source: new ImageSource({
        name: "poll3",
        settings: {
          file: asset`polls/GREEN.png`,
        },
      }),
      positionX: 360,
      positionY: 569,
      alignment: Alignment.CenterLeft,
      rotation: 0,
      cropRight: 1201,
    },
    poll4: {
      source: new ImageSource({
        name: "poll4",
        settings: {
          file: asset`polls/MAGENTA.png`,
        },
      }),
      positionX: 360,
      positionY: 569,
      alignment: Alignment.CenterLeft,
      rotation: 0,
      cropRight: 1201,
    },
    title0: {
      source: new GDIPlusTextSource({
        name: "title0",
        settings: {
          color: 0xffffffff,
          text: "",
          font: {
            face: "Comic Sans MS",
            size: 35,
          },
          outline: true,
          outline_size: 5,
          outline_color: 0xff000000,
          align: "center",
        } as any,
      }),
      enabled: false,
      positionX: 960,
      positionY: 567,
      alignment: Alignment.Center,
    },
    title1: {
      source: new GDIPlusTextSource({
        name: "title1",
        settings: {
          color: 0xffffffff,
          text: "",
          font: {
            face: "Comic Sans MS",
            size: 35,
          },
          outline: true,
          outline_size: 5,
          outline_color: 0xff000000,
          align: "center",
        } as any,
      }),
      enabled: false,
      positionX: 960,
      positionY: 567,
      alignment: Alignment.Center,
    },
    title2: {
      source: new GDIPlusTextSource({
        name: "title2",
        settings: {
          color: 0xffffffff,
          text: "",
          font: {
            face: "Comic Sans MS",
            size: 35,
          },
          outline: true,
          outline_size: 5,
          outline_color: 0xff000000,
          align: "center",
        } as any,
      }),
      enabled: false,
      positionX: 960,
      positionY: 567,
      alignment: Alignment.Center,
    },
    title3: {
      source: new GDIPlusTextSource({
        name: "title3",
        settings: {
          color: 0xffffffff,
          text: "",
          font: {
            face: "Comic Sans MS",
            size: 35,
          },
          outline: true,
          outline_size: 5,
          outline_color: 0xff000000,
          align: "center",
        } as any,
      }),
      enabled: false,
      positionX: 960,
      positionY: 567,
      alignment: Alignment.Center,
    },
    title4: {
      source: new GDIPlusTextSource({
        name: "title4",
        settings: {
          color: 0xffffffff,
          text: "",
          font: {
            face: "Comic Sans MS",
            size: 35,
          },
          outline: true,
          outline_size: 5,
          outline_color: 0xff000000,
          align: "center",
        } as any,
      }),
      enabled: false,
      positionX: 1560,
      positionY: 567,
      alignment: Alignment.Center,
    },
  },
});

export const pollWindow = new Window({
  name: "PollWindow",
  contentScene: pollScene,
  boundsItem: "PollBackground",
  icon: cameraVideoIcon,
  scale: 1,
  physics: false,
});

const iconScene = new Scene({
  name: "ICONSCENE",
  items: {
    WebIcon: {
      source: webIcon,
    },
    gameIcon: {
      source: gameIcon,
    },
    musicIcon: {
      source: musicIcon,
    },
    pollIcon: {
      source: pollIcon,
    },
    MineSweeperIcon: {
      source: MineSweeperIcon,
    },
  },
});

export const Fireworks = new BrowserSource({
  name: "Fireworks",
  settings: {
    url: "L:/Streaming/Windows xp/firework-show/firework-show/dist/index.html",
    width: 1920,
    height: 1080,
    reroute_audio: true,
  },
  filters: {
    limiter: new CompressorFilter({
      name: "AUdio",
      settings: {
        ratio: 20,
        threshold: -30,
        output_gain: 5,
      },
    }),
    Fireworks: new ColorKeyFilter({
      name: "Fireworks",
      settings: {
        similarity: 1,
        key_color: 0xff000000,
        smoothness: 739,
        key_color_type: ColorKeyColorType.Custom,
      },
    }),
  },
});

export const cameraScene = new Scene({
  name: "CamPerm",
  items: {
    CameraBackground: {
      source: new ColorSource({
        name: "CameraBackground",
      }),
    },
    camera: {
      source: new VideoCaptureSource({
        name: "ZCAM",
        filters: {
          pixelate: new PixelateShader({
            name: "PixelateHealth",
            enabled: false,
            settings: {
              PixelScale: 1024,
            },
          }),
        },
      }),
      scaleX: 0.5,
      scaleY: 0.5,
      positionX: 1920 / 2,
      positionY: 1080 / 2,
      alignment: Alignment.Center,
    },
    health: {
      source: new ColorSource({
        name: "HealthBarCamera",
        settings: {
          width: 1920,
          height: 150,
          color: 0xffffab00,
        },
        filters: {
          Fade: new ColorCorrectionFilter({
            name: "Fade",
            settings: {
              opacity: 1,
            },
          }),
        },
      }),
      positionX: 0,
      positionY: 75,
      alignment: Alignment.CenterLeft,
    },
    Text: {
      source: new GDIPlusTextSource({
        name: "HealthText",
        settings: {
          text: HealthText.toString(),
          outline: true,
          outline_color: 0xff000000,
          font: {
            size: 180,
          },
        },
      } as any),
      positionX: 10,
      positionY: 75,
      alignment: Alignment.CenterLeft,
    },
  },
});

export const cameraWindow = new Window({
  name: "Webcam",
  contentScene: cameraScene,
  boundsItem: "CameraBackground",
  scale: 0.25,
  icon: cameraVideoIcon,
  filters: {
    Zoom: new ThreeDTransform({
      name: "Zoom",
      settings: {
        "Camera.Mode": 1,
        "Camera.FieldOfView": 90,
      },
    }),
    CCorrection: new ColorCorrectionFilter({
      name: "CCorrection",
      settings: {
        opacity: 1,
      },
    }),
    FreezeFrame: new FreezeFrame({
      name: "CamFreeze",
      settings: {},
      enabled: false,
    }),
  },
});

export const bitsWindow = new Window({
  name: "Bits Maze",
  contentScene: bitsScene,
  boundsItem: "bitsBackground",
  scale: 1,
  icon: webIcon,
  physics: false,
});

export const plinkoWindow = new Window({
  name: "Plinko",
  contentScene: plinkoScene,
  boundsItem: "plinkoBackground",
  scale: 1,
  icon: webIcon,
  physics: false,
});

export const greenScreenCameraScene = new Scene({
  name: "greenScreenCameraScene",
  items: {
    camera: {
      source: new VideoCaptureSource({
        name: "greenScreenCamera",
        filters: {
          CHROMA: new ChromaKeyFilter({
            name: "ChromaKey",
            settings: {
              key_color: 0xff1f4b2b,
              key_color_type: ChromaKeyColorType.Custom,
              similarity: 66,
              smoothness: 14,
              spill: 1,
            },
          }),
          MASK: new ImageMaskBlendFilter({
            name: "Mask",
            settings: {
              image_path: "L:/Streaming/GSMASK.png",
              type: MaskBlendType.AlphaMaskAlphaChannel,
            },
          }),
          SHAKE1: new ShakeShader({
            name: "SHAKE1",
            settings: {
              Angle_Degrees: 4,
              override_entire_effect: true,
              Axis_X: 2,
              Axis_Z: 0,
              Axis_Y: 0,
              Rotate_Pixels: false,
              Rotate_Transform: true,
              speed_percent: 10000,
            },
            enabled: false,
          }),
          SHAKE2: new ShakeShader({
            name: "SHAKE2",
            settings: {
              override_entire_effect: true,
              speed_percent: 12000,
              Angle_Degrees: 4,
              Axis_X: 0,
              Axis_Z: 0,
              Axis_Y: 2,
              Rotate_Pixels: false,
              Rotate_Transform: true,
            },
            enabled: false,
          }),
          SDF: new SDFEffects({
            name: "GLOW",
            settings: {
              "Filter.SDFEffects.Glow.Outer.Color": 4294940928,
              "Filter.SDFEffects.Glow.Outer.Sharpness": 3.45,
              "Filter.SDFEffects.Glow.Outer.Width": 16,
              "Filter.SDFEffects.Glow.Outer": true,
              "Filter.SDFEffects.SDF.Scale": 15.4,
            },
            enabled: false,
          }),
        },
      }),
    },
  },
});

const chatScene = new Scene({
  name: "Chat",
  items: {
    background: {
      source: new ImageSource({
        name: "Chat Background",
        settings: {
          file: asset`Images/ChatWindow.png`,
        },
      }),
      positionX: 1920 / 2,
      positionY: 1080 / 2,
      alignment: Alignment.Center,
      rotation: 0,
    },
    chat: {
      source: new BrowserSource({
        name: "TestBrowser",
        settings: {
          url: "https://streamlabs.com/widgets/chat-box/v1/A7D1FC481E79C9B0A4BD",
          width: 476,
          height: 772,
        },
      }),
      positionX: 1920 / 2 - 8,
      positionY: 500,
      alignment: Alignment.Center,
      rotation: 0,
    },
  },
});

const chatWindow = new Window({
  name: "Chat",
  contentScene: chatScene,
  boundsItem: "background",
  scale: 1,
  icon: webIcon,
});

export const mainScene = new Scene({
  name: "Main",
  items: {
    wallpaper: {
      source: new ImageSource({
        name: "wallpaper",
        settings: {
          file: asset`images/wallpaper.png`,
        },
      }),
      alignment: Alignment.Center,
      positionX: 960,
      positionY: 540,
      scaleX: 0.426,
      scaleY: 0.426,
    },
    desktopCapture: {
      source: new DisplayCaptureSource({
        name: "Display",
      }),
      scaleX: 0.75,
      scaleY: 0.75,
    },
    PollWindowSource: {
      source: pollWindow,
      positionX: 960,
      positionY: 540,
      alignment: Alignment.Center,
      rotation: 0,
    },
    tempEventList: {
      source: eventList,
      positionX: -1000,
      positionY: -1000,
      alignment: Alignment.Center,
      rotation: 0,
    },
    cameraWindow: {
      source: cameraWindow,
      positionX: 960,
      positionY: 540,
      alignment: Alignment.Center,
      rotation: 0,
    },
    chatWindow: {
      source: chatWindow,
      positionX: 1500,
      positionY: 540,
      alignment: Alignment.Center,
      rotation: 0,
    },
    bitsWindow: {
      source: bitsWindow,
      positionX: 960,
      positionY: 540,
      alignment: Alignment.Center,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
    },
    plinkoWindow: {
      source: plinkoWindow,
      positionX: 960,
      positionY: 540,
      alignment: Alignment.Center,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
    },
    hypetrain: {
      source: HypeTrainScene,
      positionX: 960,
      positionY: 450,
      alignment: Alignment.Center,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
    },
    pixels: {
      source: pixelScene,
      positionX: 960,
      positionY: 540,
      alignment: Alignment.Center,
    },
    taskbar: {
      source: taskbar,
      positionX: 1920 / 2,
      positionY: 1080,
      alignment: Alignment.BottomCenter,
      rotation: 0,
    },
    StartMenu: {
      source: StartMenu,
      enabled: false,
    },
    StartingWrap: {
      source: StartingWrap,
      scaleX: 1,
      scaleY: 1,
      positionX: 1920 / 2,
      positionY: 1080 / 2,
      alignment: Alignment.Center,
      rotation: 0,
      enabled: (await localDB.getData("store/started")) == 0 ? true : false,
    },
    MusicWindow: {
      source: MusicWindow,
      scaleX: 1,
      scaleY: 1,
      positionX: 960,
      positionY: 200,
      alignment: Alignment.Center,
      rotation: 0,
    },
  },
  filters: {
    HTCC: new ColorCorrectionFilter({
      name: "HTCC",
      settings: {
        opacity: 1,
        brightness: 0,
      },
      enabled: false,
    }),
    BLOOM: new BloomShader({
      name: "BLOOM",
      settings: {
        Angle_Steps: 20,
        Radius_Steps: 20,
        ampFactor: 2,
      },
      enabled: false,
    }),
    DABBLOOM: new BloomShader({
      name: "DABBLOOM",
      settings: {
        Angle_Steps: 20,
        Radius_Steps: 20,
        ampFactor: 2,
      },
      enabled: false,
    }),
    DABShakeY: new ShakeShader({
      name: "DABShakeY",
      settings: {
        Angle_Degrees: 0.5,
        override_entire_effect: true,
        Axis_X: 0,
        Axis_Z: 0,
        Axis_Y: 0.7,
        Rotate_Pixels: false,
        Rotate_Transform: true,
        speed_percent: 10000,
      },
      enabled: false,
    }),
    DABShakeX: new ShakeShader({
      name: "DABShakeX",
      settings: {
        Angle_Degrees: 0.9,
        override_entire_effect: true,
        Axis_X: 0.4,
        Axis_Z: 0,
        Axis_Y: 0,
        Rotate_Pixels: false,
        Rotate_Transform: true,
        speed_percent: 9000,
      },
      enabled: false,
    }),
    HTShakeY: new ShakeShader({
      name: "HTShakeY",
      settings: {
        Angle_Degrees: 0.5,
        override_entire_effect: true,
        Axis_X: 0,
        Axis_Z: 0,
        Axis_Y: 0.7,
        Rotate_Pixels: false,
        Rotate_Transform: true,
        speed_percent: 10000,
      },
      enabled: false,
    }),
    HTShakeX: new ShakeShader({
      name: "HTShakeX",
      settings: {
        Angle_Degrees: 0.9,
        override_entire_effect: true,
        Axis_X: 0.4,
        Axis_Z: 0,
        Axis_Y: 0,
        Rotate_Pixels: false,
        Rotate_Transform: true,
        speed_percent: 9000,
      },
      enabled: false,
    }),
    VHSHT: new VHSSHader({
      name: "VHSHT",
      settings: {
        range: 0.2,
        noiseIntensity: 0.54,
        offsetIntensity: 0.01,
        colorOffsetIntensity: 1.09,
        lumaMin: 0.01,
        lumMinSMooth: 0.04,
        Alpha_Percentage: 100,
        Apply_To_Image: true,
      },
      enabled: false,
    }),
    CCorrection: new ColorCorrectionFilter({
      name: "CCorrection",
      settings: {
        saturation: -1,
      },
      enabled: false,
    }),
    pixelate: new PixelateShader({
      name: "pixelate",
      settings: {
        PixelScale: 500,
      },
      enabled: false,
    }),
    CRTPixel: new CRTShader({
      name: "CRTPixel",
      settings: {
        _0_strength: 10,
      },
      enabled: false,
    }),
    cartoon: new CartoonShader({
      name: "cartoon",
      settings: {
        hue_steps: 20,
        value_steps: 5,
        override_entire_effect: true,
      },
      enabled: false,
    }),
    WOTFreeze: new FreezeFrame({
      name: "WOTFreeze",
      enabled: false,
    }),
    BLURFORRAID: new Blur({
      name: "BLURFORRAID",
      settings: {
        "Filter.Blur.Type": "gaussian",
        "Filter.Blur.Size": 20,
      },
      enabled: false,
    }),
    TBCFreeze: new FreezeFrame({
      name: "TBCFreeze",
      enabled: false,
    }),
    RecordScratchFilter: new FreezeFrame({
      name: "RecordScratchFilter",
      enabled: false,
    }),
    SaxaphoneFreeze: new FreezeFrame({
      name: "SaxaphoneFreeze",
      enabled: false,
    }),
    STRAYATRANSFORM: new ThreeDTransform({
      name: "STRAYATRANSFORM",
      settings: {
        "Camera.Mode": 1,
        "Rotation.X": 180,
        "Camera.FieldOfView": 90,
      },
      enabled: false,
    }),
    SaxaphoneTransform: new ThreeDTransform({
      name: "SaxaphoneTransform",
      settings: {
        "Camera.Mode": 1,
        "Camera.FieldOfView": 90,
        "Scale.X": 100,
        "Scale.Y": 100,
        "Rotation.X": 0,
        "Rotation.Y": 0,
        "Rotation.Z": 0,
      },
      enabled: false,
    }),
    RecordTransform: new ThreeDTransform({
      name: "RecordTransform",
      settings: {
        "Camera.Mode": 1,
        "Camera.FieldOfView": 90,
      },
    }),
  },
});

export const MainWrapper = new Scene({
  name: "MainWrapper",
  items: {
    Main: {
      source: mainScene,
      positionX: 960,
      positionY: 540,
      alignment: Alignment.Center,
      rotation: 0,
      scaleX: 1,
      scaleY: 1,
    },
  },
});

export async function setupObs() {
  console.log("is this running?");
  setupPhysics();
  console.log("is this running?2");
  setupBits();
  console.log("is this running?3");
  await obs.connect("ws:localhost:4455");

  // necessary so that icons have transforms updated before being used
  await iconScene.create(obs);

  await greenScreenCameraScene.create(obs);

  await taskbar.create(obs);

  await plinkoScene.create(obs);

  await MainWrapper.create(obs);

  await setupPlinko();

  await obs.clean();

  mainScene.item("chatWindow").toggleMinimised();

  mainScene.item("PollWindowSource").toggleMinimised();

  mainScene.item("bitsWindow").toggleMinimised();

  mainScene.item("plinkoWindow").toggleMinimised();

  mainScene.item("MusicWindow").toggleMinimised();

  startPhysics();
  startPlinkoPhysics();
  startBitsPhysics();
  MotionBlurTick();
  resumeRedemptionQueue();

  setInterval(() => {
    let angle = 0;
    if (mainScene.item("cameraWindow").transform.positionX < 960) {
      angle =
        90 -
        (Math.atan2(
          mainScene.item("cameraWindow").transform.positionY,
          960 - mainScene.item("cameraWindow").transform.positionX
        ) *
          180) /
          Math.PI;
    } else {
      angle =
        90 -
        (Math.atan2(
          mainScene.item("cameraWindow").transform.positionY,
          mainScene.item("cameraWindow").transform.positionX - 960
        ) *
          180) /
          Math.PI;
    }
  }, 16);

  let MainCamInfo = (
    await obs.call("GetInputPropertiesListPropertyItems", {
      inputName: cameraScene.item("camera").source.name,
      propertyName: "video_device_id",
    })
  ).propertyItems.find((data) => data.itemName.includes("UVC"));

  if (MainCamInfo)
    await cameraScene.item("camera").source.setSettings({
      video_device_id: MainCamInfo.itemValue,
      resolution: "3840x2160",
      res_type: 1,
    });

  // let GreenScreenCamInfo = (
  //   await obs.call("GetInputPropertiesListPropertyItems", {
  //     inputName: greenScreenCameraScene.item("camera").source.name,
  //     propertyName: "video_device_id",
  //   })
  // ).propertyItems.find((data) => data.itemName.includes("DUO - 2"));

  // if (GreenScreenCamInfo)
  //   await greenScreenCameraScene
  //     .item("camera")
  //     .source.setSettings({ video_device_id: GreenScreenCamInfo.itemValue });

  let displayInfo = await obs.call("GetInputPropertiesListPropertyItems", {
    inputName: mainScene.item("desktopCapture").source.name,
    propertyName: "monitor",
  });

  let MonitorNumber = 0;

  displayInfo.propertyItems.forEach((data) => {
    if (data.itemName.includes("Primary Monitor")) {
      mainScene
        .item("desktopCapture")
        .source.setSettings({ monitor: data.itemValue });
    }
  });
}

export function FUCKINGFOLLOWCUNT(name: string) {
  console.log("new follower");
  GenericSound("Follow", asset`sounds/follow.mp3`);
}
