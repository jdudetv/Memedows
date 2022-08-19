import { createRedemptionHandler, redemptionEnded } from "./base";
import { greenScreenCameraScene, mainScene, obs } from "~/obs/Main";
import { Alignment, MonitoringType, Scene } from "@sceneify/core";
import {
  BrowserSource,
  GDIPlusTextSource,
  ImageSource,
  MediaSource,
} from "@sceneify/sources";
import { ScrollFilter } from "@sceneify/filters";
import { v4 as uuidv4 } from "uuid";
import { asset, wait } from "~/utils";
import { VLC_Source } from "~/obs/sources/VLC";
import { animate, Easing, keyframe } from "@sceneify/animation";
import { Blur } from "~/obs/filters";
import { checkSubbed, GetProfilePic } from "~/data/services/twitchApi";
import { GenericSound, TTSFunction } from "~/obs/redemptions";
import { random } from "nanoid";

createRedemptionHandler({
  event: "breakingnews",
  handler: async (data) => {
    GenericSound("BreakingNewsSoundIntro", asset`sounds/NewsIntro.mp3`, -15);

    // let SubData = await checkSubbed(data.userId);

    // let subbedProfilePic = await GetProfilePic(data.userId);

    // console.log(subbedProfilePic);

    const image = new BrowserSource({
      name: "RandomPerson",
      settings: {
        url: "https://thispersondoesnotexist.com/image",
        width: 300,
        height: 300,
      },
    });

    const OverlayElements = new Scene({
      name: "OverlayElements",
      items: {
        LowerThird: {
          source: new ImageSource({
            name: "LowerThird",
            settings: {
              file: asset`news/lowerThird.png`,
            },
          }),
          positionX: 960,
          positionY: 540,
          alignment: Alignment.Center,
        },
        GuestSpeaker: {
          source: new ImageSource({
            name: "GuestSpeaker",
            settings: {
              file: asset`news/guest.png`,
            },
          }),
          positionX: 300,
          positionY: 540,
          alignment: Alignment.Center,
          enabled: true,
        },
        RandomPerson: {
          source: image,
          scaleX: 1.25,
          scaleY: 1.25,
          positionX: -269,
          positionY: 385,
          alignment: Alignment.Center,
        },
        lowerThirdPic: {
          source: image,
          positionX: 142,
          positionY: 881,
          alignment: Alignment.Center,
          scaleX: 0.3,
          scaleY: 0.3,
        },
        NamePerson: {
          source: new GDIPlusTextSource({
            name: "NamePerson",
            settings: {
              text: data.userName,
              font: {
                face: "Comic Sans MS",
                size: 40,
              },
              color: 0xff000000,
              align: "left",
            } as any,
          }),
          positionX: -415,
          positionY: 606,
          alignment: Alignment.CenterLeft,
        },
        LowerThirdText: {
          source: new GDIPlusTextSource({
            name: "LowerThirdText",
            settings: {
              text: data.userName + " Reporting LIVE",
              font: {
                face: "Comic Sans MS",
                size: 80,
              },
              color: 0xff000000,
              align: "left",
            } as any,
          }),
          positionX: 200,
          positionY: 880,
          alignment: Alignment.CenterLeft,
        },
        EnteredText: {
          source: new GDIPlusTextSource({
            name: "EnteredText",
            settings: {
              text: data.input + " ",
              font: {
                face: "Comic Sans MS",
                size: 40,
              },
              color: 0xffffffff,
              align: "left",
              extents_cx: 9999,
              extents_cy: 270,
            } as any,
          }),
          positionX: 96,
          positionY: 957,
          alignment: Alignment.CenterLeft,
        },
        ClockThing: {
          source: (mainScene.item("taskbar")?.source as Scene).item("clock")!
            .source,
          positionX: 1749,
          positionY: 813,
          alignment: Alignment.Center,
          scaleX: 0.5,
          scaleY: 0.5,
        },
      },
    });

    const newsRoom = new Scene({
      name: "newsRoom",
      items: {
        NewsBackground: {
          source: new VLC_Source({
            name: "NewsBackground",
            settings: {
              playback_behavior: "always_play",
              playlist: [
                {
                  hidden: false,
                  selected: false,
                  value: "L:/Streaming/assets/news/timelapse",
                },
              ],
              shuffle: true,
            },
          }),
          positionX: 960,
          positionY: 450,
          scaleX: 0.3,
          scaleY: 0.3,
          alignment: Alignment.Center,
        },
        DeskBackground: {
          source: new ImageSource({
            name: "DeskBackground",
            settings: {
              file: asset`news/deskback.png`,
            },
          }),
          positionX: 960,
          positionY: 540,
          alignment: Alignment.Center,
        },
        PRESENTOR: {
          source: greenScreenCameraScene,
          positionX: 960,
          positionY: 450,
          alignment: Alignment.Center,
          rotation: 90,
          scaleX: 0.65,
          scaleY: 0.65,
          cropRight: 600,
        },
        ChatBackground: {
          source: new ImageSource({
            name: "ChatBackground",
            settings: {
              file: asset`news/background.png`,
            },
          }),
          positionX: 965,
          positionY: 800,
          scaleX: 0.52,
          scaleY: 0.52,
          alignment: Alignment.Center,
        },
        ChatBrowser: {
          source: new BrowserSource({
            name: "ChatBrowser",
            settings: {
              url: "https://streamlabs.com/widgets/chat-box/v1/A7D1FC481E79C9B0A4BD",
              width: 650,
              height: 300,
            },
          }),
          scaleX: 0.7,
          scaleY: 0.7,
          positionX: 960,
          positionY: 800,
          alignment: Alignment.Center,
        },
        DeskFront: {
          source: new ImageSource({
            name: "DeskFront",
            settings: {
              file: asset`news/deskfront.png`,
            },
          }),
          positionX: 960,
          positionY: 540,
          alignment: Alignment.Center,
        },
      },
    });

    const TheNews = new Scene({
      name: "TheNews",
      items: {
        Backing: {
          source: newsRoom,
          positionX: 960,
          positionY: 540,
          alignment: Alignment.Center,
          enabled: false,
        },
        Overlay: {
          source: OverlayElements,
          enabled: false,
        },
      },
    });

    let news1 = await newsRoom.create(obs);
    let news2 = await OverlayElements.create(obs);
    let news3 = await TheNews.create(obs);

    await OverlayElements.item("EnteredText").source.addFilter(
      "scrolling",
      new ScrollFilter({
        name: "scrolling",
        settings: {
          loop: true,
          speed_x: 30,
        },
      })
    );

    if (OverlayElements.item("EnteredText").transform.width >= 1548) {
      OverlayElements.item("EnteredText").setTransform({
        cropRight: OverlayElements.item("EnteredText").transform.width - 1548,
      });
    }

    await newsRoom.item("NewsBackground").source.addFilter(
      "Blur",
      new Blur({
        name: "BlurShader",
        settings: {
          "Filter.Blur.Type": "gaussian",
          "Filter.Blur.Size": 10,
        },
      })
    );

    await newsRoom.item("DeskBackground").source.addFilter(
      "Blur",
      new Blur({
        name: "BlurShader",
        settings: {
          "Filter.Blur.Type": "gaussian",
          "Filter.Blur.Size": 5,
        },
      })
    );

    let NewsMain = await mainScene.createItem("NewsItself", {
      source: TheNews,
      enabled: false,
    });

    let NewIntro = await mainScene.createItem("NewsIntro", {
      source: new MediaSource({
        name: "NewsIntro",
        settings: {
          local_file: asset`news/NewsIntroShort.mov`,
        },
      }),
    });

    let LoopingMusic = new MediaSource({
      name: "LoopingMusic",
      settings: {
        local_file: asset`sounds/NewsStandby.mp3`,
        looping: true,
      },
    });

    setTimeout(async () => {
      await TheNews.createItem("LoopingMusic", {
        source: LoopingMusic,
      });

      await LoopingMusic.setAudioMonitorType(MonitoringType.MonitorAndOutput);
    }, 8000);

    setTimeout(() => {
      NewIntro.remove();
    }, 35000);

    await wait(5000);

    NewsMain.setEnabled(true);

    await wait(2500);

    await animate({
      subjects: {
        Main: TheNews.item("Backing"),
      },
      keyframes: {
        Main: {
          scaleX: {
            0: 1,
            10000: keyframe(2, Easing.Out),
          },
          scaleY: {
            0: 1,
            10000: keyframe(2, Easing.Out),
          },
        },
      },
    });

    animate({
      subjects: {
        Main: OverlayElements.item("GuestSpeaker"),
        MainImage: OverlayElements.item("RandomPerson"),
        MainText: OverlayElements.item("NamePerson"),
        Back: TheNews.item("Backing"),
      },
      keyframes: {
        Main: {
          positionX: {
            3000: keyframe(960, Easing.Out),
          },
        },
        MainImage: {
          positionX: {
            3000: keyframe(391, Easing.Out),
          },
        },
        MainText: {
          positionX: {
            3000: keyframe(245, Easing.Out),
          },
        },
        Back: {
          positionX: {
            3000: keyframe(1140, Easing.InOut),
          },
        },
      },
    });

    let text =
      "Thankyou Jay dude, so were getting reports " +
      data.input +
      " ,This has been " +
      data.userName +
      " Back to you jay dude.";

    await TTSFunction(text);

    await animate({
      subjects: {
        Main: OverlayElements.item("GuestSpeaker"),
        MainImage: OverlayElements.item("RandomPerson"),
        MainText: OverlayElements.item("NamePerson"),
        Back: TheNews.item("Backing"),
      },
      keyframes: {
        Main: {
          positionX: {
            3000: keyframe(300, Easing.InOut),
          },
        },
        MainImage: {
          positionX: {
            3000: keyframe(-269, Easing.InOut),
          },
        },
        MainText: {
          positionX: {
            3000: keyframe(-415, Easing.InOut),
          },
        },
        Back: {
          positionX: {
            3000: keyframe(960, Easing.InOut),
          },
        },
      },
    });

    await wait(3000);

    let NewOutro = await mainScene.createItem("NewOutro", {
      source: new MediaSource({
        name: "NewOutro",
        settings: {
          local_file: asset`news/Newsoutro.mov`,
        },
      }),
    });

    NewOutro.source.setAudioMonitorType(MonitoringType.MonitorAndOutput);

    setTimeout(async () => {
      await NewsMain.remove();
      await news1.remove();
      await news2.remove();
      await news3.remove();
    }, 3000);

    for (let i = 0; i > -60; i--) {
      await wait(100);
      TheNews.item("LoopingMusic")?.source.setVolume({ db: i });
    }

    setTimeout(() => {
      TheNews.item("LoopingMusic")?.remove();
    }, 5000);

    setTimeout(() => {
      NewOutro.remove();
    }, 15000);

    await wait(12000);

    redemptionEnded("breakingnews");
  },
});
