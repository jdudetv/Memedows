import { createRedemptionHandler, redemptionEnded } from "./base";
import { FilthyFrank } from "~/obs/redemptions/FF";
import { CreatePoll } from "~/data/services/twitchApi";
import { eventsStore } from "~/data/stores";
import { TMIClient } from "~/data/services/emotes";
import { wait } from "~/utils";
import { TTSFunction } from "~/obs/redemptions";
import { localDB } from "~/data/jsondb";

let pollID: string;
let prevdata;
let PollFinished = 0;
let Username = "";
let Victim = "";

createRedemptionHandler({
  event: "hcourt",
  handler: async (data) => {
    await wait(400);
    if (data.input.startsWith("@")) data.input = data.input.slice(1);
    console.log("horny court started.");
    pollID = await CreatePoll(
      `Should ${data.input} Be sent to H. jail?`,
      [{ title: "Yes" }, { title: "No" }],
      60
    );
    Username = data.userName.trim();
    Victim = data.input.trim();
  },
});

eventsStore.on("pollEnd", async (p) => {
  let prevID = localDB.getData("/store/Hcourt/id/");
  if (prevID === p.id) return;
  localDB.push("/store/Hcourt/id/", p.id);
  if (p.title.includes("jail?")) {
    console.log("horny jail completed");
    if (p.choices[0].votes === p.choices[1].votes) {
      console.log("Draw");
      redemptionEnded("hcourt");
      await TMIClient.say("jdudetv", `ITS A DRAW BOTH ARE TOO HORNY GOODBYE.`);
      TTSFunction(
        `ITS A DRAW BOTH ARE TOO HORNY AND WILL BE SENT TO HORNY JAIL. GOODBYE.`
      );
      await wait(5000);
      await TMIClient.say("jdudetv", "/timeout " + Victim + " 69 HORNY JAIL");
      await TMIClient.say("ocefam", "/timeout " + Victim + " 69 HORNY JAIL");
      await wait(5000);
      await TMIClient.say("jdudetv", "/timeout " + Username + " 69 HORNY JAIL");
      await TMIClient.say("ocefam", "/timeout " + Username + " 69 HORNY JAIL");
    }
    if (p.choices[0].votes > p.choices[1].votes) {
      console.log("victim guilt");
      redemptionEnded("hcourt");
      await TMIClient.say(
        "ocefam",
        `${Victim} Has been found guilty of horny and sentenced to Horny jail. Goodbye.`
      );
      await TMIClient.say(
        "jdudetv",
        `${Victim} Has been found guilty of horny and sentenced to Horny jail. Goodbye.`
      );
      TTSFunction(
        `${Victim} Has been found guilty of horny and sentenced to Horny jail. Goodbye.`
      );
      await wait(5000);
      await TMIClient.say("jdudetv", "/timeout " + Victim + " 69 HORNY JAIL");
    } else if (p.choices[0].votes < p.choices[1].votes) {
      console.log("not guilty");
      redemptionEnded("hcourt");
      await TMIClient.say(
        "jdudetv",
        `${Victim} Has been found NOT GUILTY of horny and ${Username} is sentenced to Horny jail for the false report. Goodbye.`
      );
      await TMIClient.say(
        "ocefam",
        `${Victim} Has been found NOT GUILTY of horny and ${Username} is sentenced to Horny jail for the false report. Goodbye.`
      );
      TTSFunction(
        `${Victim} Has been found NOT GUILTY of horny and ${Username} is sentenced to Horny jail for the false report. Goodbye.`
      );
      await wait(5000);
      await TMIClient.say("jdudetv", "/timeout " + Username + " 69 HORNY JAIL");
      TMIClient.timeout("ocefam", Username, 69, "horny jail");
    }
  }
});
