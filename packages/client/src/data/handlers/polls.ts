import { Alignment, Scene, SceneItem } from "@sceneify/core";
import { GDIPlusTextSource, ImageSource } from "@sceneify/sources";
import { animate, Easing, keyframe } from "@sceneify/animation";
import { mainScene, pollScene, pollWindow } from "~/obs/Main";
import { cameraVideoIcon, pollIcon } from "~/obs/sprites";
import Window, { WindowItem } from "~/obs/Window";
import { asset } from "~/utils";
import { TMIClient } from "../services/emotes";
import { eventsStore, redemptionsStore } from "../stores";

let CurrentPoll: string;

let lastPoll: number;

eventsStore.on("pollProgress", async (p) => {
  if (p.id !== CurrentPoll) return;
  let totalVotes = 0;
  let Votesarray = [];
  p.choices.length;
  for (let [index, choice] of p.choices.entries()) {
    totalVotes += choice.votes;
    Votesarray.unshift({ title: choice.title, votes: choice.votes });
  }
  console.log(Votesarray);
  lastPoll = totalVotes;
  let CropFactor = 0;
  let Votes = 0;
  let increment = 1200 / totalVotes;
  for (let [index, choice] of Votesarray.entries()) {
    if (choice.votes > 0) {
      pollScene.item(`title${index}`)!.setEnabled(true);
    }
    (pollScene.item(`title${index}`)!.source as GDIPlusTextSource).setSettings({
      text: choice.title.toUpperCase(),
    });

    let Lastcropfactor = CropFactor;

    let textPos = 0;

    if (totalVotes === choice.votes) {
      CropFactor = 0;
      textPos = 960;
    } else {
      if (index === 0) {
        textPos = 1560 - (choice.votes * increment) / 2;
        Votes += choice.votes;
      } else {
        if (choice.votes !== 0) {
          CropFactor = Votes * increment;
          textPos = 1200 - CropFactor + 360 - (choice.votes * increment) / 2;
          Votes += choice.votes;
        }
      }
    }
    animate({
      subjects: {
        Object: pollScene.item(`poll${index}`)!,
        text: pollScene.item(`title${index}`)!,
      },
      keyframes: {
        text: {
          positionX: {
            1000: choice.votes === 0 ? 960 : textPos,
          },
        },
        Object: {
          cropRight: {
            1000:
              index === 0
                ? 0
                : choice.votes === totalVotes
                ? 0
                : choice.votes === 0
                ? 1201
                : CropFactor,
          },
        },
      },
    });
  }
});

let PollFinished = false;

eventsStore.on("pollBegin", async (p) => {
  CurrentPoll = p.id;
  PollFinished = false;
  let data = Date.parse(p.startedAt);
  let date = Date.parse(p.endsAt);

  for (let i = 0; i < 5; i++) {
    await pollScene.item(`title${i}`)!.setEnabled(false);
    await pollScene.item(`poll${i}`)!.setTransform({
      cropRight: 1200,
    });
  }

  await pollScene.item("pollTitle").source.setSettings({
    text: p.title.toUpperCase(),
  });

  mainScene.item("PollWindowSource").toggleMinimised();

  setTimeout(async () => {
    mainScene.item("PollWindowSource").toggleMinimised();
  }, date - data - 1000);
});
