import { Alignment, MonitoringType, Scene } from "@sceneify/core";
import {
  BrowserSource,
  ColorSource,
  GDIPlusTextSource,
  ImageSource,
  MediaSource,
} from "@sceneify/sources";
import { asset } from "~/utils";
import {
  CRTShader,
  RainbowShader,
  ScanlineShader,
  ThreeDTransform,
} from "./filters";
import { Visualiser } from "./sources/visualiser";

export const MonitorScene = new Scene({
  name: "MonitorScene",
  items: {
    ChatStarting: {
      source: new BrowserSource({
        name: "ChatStarting",
        settings: {
          url: "https://streamelements.com/overlay/61679275cec008cc66451d95/8gl0RB00qRArE2NxN40b",
          width: 1920,
          height: 1080,
        },
      }),
      positionX: 960,
      positionY: 540,
      alignment: Alignment.Center,
      scaleX: 1,
      scaleY: 1,
      enabled: true,
    },
    Loading: {
      source: new MediaSource({
        name: "Loading",
        settings: {
          local_file: `L:/Streaming/assets/Starting/StartupLoop.mp4`,
          looping: true,
        } as any,
      }),
      positionX: 960,
      positionY: 540,
      alignment: Alignment.Center,
      scaleX: 1,
      scaleY: 1,
      enabled: false,
    },
    // ScreenVisual: {
    //   source: new Visualiser({
    //     name: "ScreenVisual",
    //     settings: {
    //       audio_source: "Mic/Aux",
    //       bar_space: 0,
    //       color: 4294967295,
    //       corner_points: 5,
    //       corner_radius: 0.5,
    //       detail: 150,
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
    //   }),
    //   positionX: 958,
    //   positionY: 654,
    //   scaleX: 0.24,
    //   scaleY: 0.24,
    //   alignment: Alignment.Center,
    //   enabled: false,
    // },
    Screen: {
      source: new MediaSource({
        name: "Screen",
        settings: {
          local_file: asset`Starting/Bios post.mov`,
          clear_on_media_end: false,
        } as any,
      }),
      positionX: 960,
      positionY: 540,
      scaleX: 3.8,
      scaleY: 2.8,
      enabled: false,
      alignment: Alignment.Center,
    },
    diskSpinUp: {
      source: new MediaSource({
        name: "DIskSpinUpSound",
        settings: {
          local_file: asset`Starting/diskStart.mp3`,
        },
        audioMonitorType: MonitoringType.MonitorAndOutput,
      }),
      positionX: 9999,
      positionY: 9999,
      enabled: false,
    },
  },
  filters: {
    SCANLINE: new ScanlineShader({
      name: "SCANLINE",
      settings: {
        _0_Strength: 40,
        "_1_Intensity[0]": 95,
      },
    }),
    CRT: new CRTShader({
      name: "CRT",
      settings: {
        _0_strength: 33.33,
        _2_feathering: 25,
      },
    }),
  },
});

export const StartingScene = new Scene({
  name: "StartingDesk",
  items: {
    AlbumArt: {
      source: new ImageSource({
        name: "AlbumArt",
        settings: {
          file: "L:/Streaming/assets/music/albumart.png",
        },
        filters: {
          perspective: new ThreeDTransform({
            name: "perspective",
            settings: {
              "Camera.Mode": 1,
              "Camera.FieldOfView": 25.45,
              Mipmapping: false,
              "Position.X": 0,
              "Position.Y": 500,
              "Position.Z": -4000,
              "Rotation.Order": 4,
              "Rotation.X": 26.87,
              "Rotation.Y": 21.8,
              "Rotation.Z": -5.58,
              "Scale.X": 100,
              "Scale.Y": 100,
              "Shear.X": 0,
              "Shear.Y": 0,
            },
          }),
        },
      }),
      positionX: 81,
      positionY: 368,
    },
    // Visualiser: {
    //   source: new Visualiser({
    //     name: "Visualiser",
    //     settings: {
    //       audio_source: "Mic/Aux",
    //       bar_space: 0,
    //       color: 4294967295,
    //       corner_points: 5,
    //       corner_radius: 0.5,
    //       detail: 150,
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

    //       perspective: new ThreeDTransform({
    //         name: "perspective",
    //         settings: {
    //           "Camera.Mode": 1,
    //           "Camera.FieldOfView": 103.69,
    //           Mipmapping: false,
    //           "Position.X": 0,
    //           "Position.Y": 0,
    //           "Position.Z": -300,
    //           "Rotation.Order": 4,
    //           "Rotation.X": 27.89,
    //           "Rotation.Y": 36,
    //           "Rotation.Z": 0,
    //           "Scale.X": 100,
    //           "Scale.Y": 100,
    //           "Shear.X": 0,
    //           "Shear.Y": 0,
    //         },
    //       }),
    //     },
    //   }),
    //   positionX: 227,
    //   positionY: 725,
    //   scaleX: 0.393,
    //   scaleY: 0.393,
    // },
    Desk: {
      source: new ImageSource({
        name: "Desk",
        settings: {
          file: asset`Starting/background intro.png`,
        },
      }),
      positionX: 1920 / 2,
      positionY: 1080 / 2,
      alignment: Alignment.Center,
      rotation: 0,
    },
    OfficeSound: {
      source: new MediaSource({
        name: "OfficeSound",
        settings: {
          local_file: asset`Starting/background intro.mp3`,
          looping: true,
        } as any,
        volume: {
          db: 0,
        },
        audioMonitorType: MonitoringType.MonitorAndOutput,
      }),
      positionX: 9999,
      positionY: 9999,
      enabled: true,
    },
    Chatters: {
      source: new GDIPlusTextSource({
        name: "Chatters",
        settings: {
          text: "",
          font: {
            face: "Comic Sans MS",
            flags: 1,
            size: 25,
          },
          color: 0xff000000,
          extents: true,

          wrap: true,
          extents_cx: 200,
          extents_cy: 270,
          valign: "top",
          align: "center",
        } as any,
        filters: {
          perspective: new ThreeDTransform({
            name: "perspective",
            settings: {
              "Camera.Mode": 1,
              "Rotation.Y": 1.5,
              "Rotation.Z": 5,
            },
          }),
        },
      }),
      positionX: 396,
      positionY: 329,
      alignment: Alignment.Center,
      rotation: 0,
    },
    currentSong: {
      source: new GDIPlusTextSource({
        name: "CurrentArtist",
        settings: {
          read_from_file: true,
          file: "L:/Streaming/assets/music/song.txt",
          font: {
            face: "Comic Sans MS",
            flags: 1,
            size: 25,
          },
          color: 0xff000000,
          extents: true,

          wrap: true,
          extents_cx: 192,
          extents_cy: 126,
          valign: "top",
          align: "center",
        } as any,
      }),
      positionX: 280,
      positionY: 710,
      alignment: Alignment.Center,
      rotation: -2.5,
    },
    deskClockhours: {
      source: new GDIPlusTextSource({
        name: "deskClockhours",
        settings: {
          text: "10",
          font: {
            face: "DS-Digital",
            size: 52,
          },
          color: 0xff000000,
          align: "center",
        } as any,
      }),
      positionX: 1402,
      positionY: 890,
      alignment: Alignment.CenterRight,
      rotation: 5.3,
    },
    deskClockminutes: {
      source: new GDIPlusTextSource({
        name: "deskClockminutes",
        settings: {
          text: "00",
          font: {
            face: "DS-Digital",
            size: 52,
          },
          color: 0xff000000,
          align: "center",
        } as any,
      }),
      positionX: 1468,
      positionY: 896,
      alignment: Alignment.CenterRight,
      rotation: 5.3,
    },
  },
});

export const StartingWrap = new Scene({
  name: "StartingWrap",
  items: {
    TheVoid: {
      source: new ColorSource({
        name: "bigblacksource",
        settings: {
          width: 1920,
          height: 1080,
          color: 0xff000000,
        },
      }),
      enabled: true,
    },
    MonitorScene: {
      source: MonitorScene,
      positionX: 865,
      positionY: 620,
      alignment: Alignment.Center,
      scaleX: 0.212,
      scaleY: 0.28,
      enabled: true,
    },
    StartingScene: {
      source: StartingScene,
      scaleX: 1,
      scaleY: 1,
      positionX: 1920 / 2,
      positionY: 1080 / 2,
      alignment: Alignment.Center,
      rotation: 0,
      enabled: true,
    },
  },
});
