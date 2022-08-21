import { createRedemptionHandler, redemptionEnded } from "./base";
import { FilthyFrank } from "~/obs/redemptions/FF";
import { CreatePoll } from "~/data/services/twitchApi";
import { eventsStore, redemptionsStore } from "~/data/stores";
import { TMIClient } from "~/data/services/emotes";
import { wait } from "~/utils";
import { TTSFunction } from "~/obs/redemptions";
import { freeTier } from "..";
import { localDB } from "~/data/jsondb";

let pollID: string;
let results;

createRedemptionHandler({
  event: "freetiervote",
  handler: async (data) => {
    let Redemptions = [
      "ff",
      "videos",
      "sounds",
      "macaroni",
      "rage",
      "calculating",
      "minesweeper",
      "pixelate",
    ];

    // await redemptionsStore.toggleRedemption("FreeTierVote", false);
    let Options = [];
    for (let i = 0; i < 5; i++) {
      let number = Math.floor(Math.random() * Redemptions.length);
      Options.push(Redemptions[number]);
      Redemptions.splice(number, 1);
    }
    pollID = await CreatePoll(
      `What should be the free redemption?`,
      [
        { title: Options[0] },
        { title: Options[1] },
        { title: Options[2] },
        { title: Options[3] },
        { title: Options[4] },
      ],
      60
    );
    results = Options;
  },
});

eventsStore.on("pollEnd", async (p) => {
  if (p.title.includes("redemption?")) {
    console.log("free tier");
    let votes = [];
    if (p.choices.length < 5) return;
    for (let choices of p.choices) {
      votes.push({ title: choices.title, votes: choices.votes });
    }
    votes.sort((a, b) => b.votes - a.votes);
    console.log(votes);
    if (votes[0].votes === votes[1].votes) {
      redemptionEnded("freetiervote");
      console.log("no winner");
      return;
    }
    let winner = votes[0];
    freeTier(winner.title);
    console.log("winner picked");
    redemptionEnded("freetiervote");
  }
});
