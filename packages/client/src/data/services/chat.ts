import { GenericSound, TTSFunction } from "~/obs/redemptions";
import { asset } from "~/utils";
import { localDB } from "../jsondb";
import { TMIClient } from "./emotes";
import { v4 as uuidv4 } from "uuid";
import { mainScene, pixelScene, rotation } from "~/obs/Main";
import { toggleStartMenu } from "~/obs/startMenu";
import { TTSingChat } from "../handlers/redemptions/ALLTTS";
import { doc, getDoc, increment, updateDoc } from "firebase/firestore";
import { UserData } from "@memedows/types";
import { db, getUserData } from "./firebase";
import { StartingScene } from "~/obs/StartingScene";
import { GetID } from "./twitchApi";
import { FakeEvent, redemptionsStore } from "../stores";
import { wiggle } from "../handlers/raid";
import { rotateanim, rotateStop } from "../handlers/redemptions/bitsMaze";
import { ColorSource } from "@sceneify/sources";
import { Alignment } from "@sceneify/core";
import { CurrSong } from "../handlers";

let yoObject = localDB.getData("/store/yoStore/");
let chatters = localDB.getData("/store/chatters/");

let mods = [
  "itemmy0",
  "hannah_gbs",
  "dropdeadartemus",
  "thaprofessor11",
  "reotto",
  "jdudetv",
  "anjy93",
  "brendonovich",
  "fred_mackay",
  "hispanic_at_the_di5co",
];

setInterval(() => {
  if (yoObject.cooldown > 0) {
    yoObject.cooldown--;
    localDB.push("/store/yoStore", yoObject);
  }
}, 1000);

let raidToggle = 0;

export function RaidTog(num: number) {
  raidToggle = num;
}

let waterCooldown = 0;

TMIClient.on("message", async (channel, tags, message, self) => {
  if (channel === "#ocefam") {
    if (message === "!start") {
      if (!mainScene.item("StartMenu").enabled) toggleStartMenu();
    }
    if (message.toLowerCase().includes("!vip")) {
      let docID = tags["user-id"]?.toString();
      if (!docID) return;
      const userData = await getUserData(docID);
      if (!userData) return;
      if (userData.xp > 10000) {
        TMIClient.say("jdudetv", `/vip ${tags.username}`);
        TMIClient.say(
          "ocefam",
          `${tags.username} You have been granted VIP for todays stream in the main chat.`
        );
        await updateDoc(doc(db, "users", docID), {
          xp: increment(-10000),
        });
        localDB.push("/store/VIPs", [tags.username], false);
      } else {
        TMIClient.say(
          "ocefam",
          `Sorry ${tags.username} you dont have enough Xp for !vip`
        );
      }
    }
    if (message.toLowerCase().includes("!ttschat")) {
      let docID = tags["user-id"]?.toString();
      if (!docID) return;
      const userData = await getUserData(docID);
      if (!userData) return;
      if (userData.xp > 10000) {
        FakeEvent("ttschat", tags.username);
        await updateDoc(doc(db, "users", docID), {
          xp: increment(-10000),
        });
        return;
      } else {
        TMIClient.say(
          "ocefam",
          `Sorry ${tags.username} you dont have enough Xp for !TTSChat`
        );
        return;
      }
    }
    if (message.toLowerCase().includes("!emoteonly")) {
      let docID = tags["user-id"]?.toString();
      if (!docID) return;
      const userData = await getUserData(docID);
      if (!userData) return;
      if (userData.xp > 5000) {
        await updateDoc(doc(db, "users", docID), {
          xp: increment(-5000),
        });
        console.log();
        TMIClient.say("jdudetv", `/emoteonly`);
        TMIClient.say(
          "jdudetv",
          `${tags.username} has turned on emote only mode.`
        );
        TMIClient.say(
          "ocefam",
          `${tags.username} You have turned on emote only mode.`
        );
        setTimeout(() => {
          TMIClient.say("jdudetv", `/emoteonlyoff`);
        }, 120000);
      }
    }
    if (message.toLowerCase().includes("!global50pdiscount")) {
      console.log("50p");
      let docID = tags["user-id"]?.toString();
      if (!docID) return;
      const userData = await getUserData(docID);
      if (!userData) return;
      if (userData.xp > 50000) {
        await updateDoc(doc(db, "users", docID), {
          xp: increment(-50000),
        });
        redemptionsStore.Discount(0.5);
        redemptionsStore.redemptions.forEach((data) => {
          redemptionsStore.updateRedemption(data);
        });
        TMIClient.say(
          "jdudetv",
          `${tags.username} has applied a 50% discount for the next 5 minutes.`
        );
        TMIClient.say(
          "ocefam",
          `${tags.username} You have applied a 50% discount for the next 5 minutes.`
        );
        setTimeout(() => {
          redemptionsStore.Discount(1);
        }, 300000);
      }
    }
    if (message.toLowerCase().includes("!50pdiscount")) {
      console.log("50p");
      let docID = tags["user-id"]?.toString();
      if (!docID) return;
      const userData = await getUserData(docID);
      if (!userData) return;
      if (userData.xp > 5000) {
        var command = message.substr(13);
        let error = await redemptionsStore.Specificdiscount(0.5, command);
        if (error !== undefined) {
          redemptionsStore.redemptions.forEach((data) => {
            redemptionsStore.updateRedemption(data);
          });
          await updateDoc(doc(db, "users", docID), {
            xp: increment(-5000),
          });
          TMIClient.say(
            "jdudetv",
            `${tags.username} has made ${command} 50% off for 5 minutes.`
          );
          TMIClient.say(
            "ocefam",
            `${tags.username} has made ${command} 50% off for 5 minutes.`
          );
          setTimeout(() => {
            redemptionsStore.Specificdiscount(1, command);
          }, 300000);
        } else {
          TMIClient.say(
            "ocefam",
            `${tags.username}, ${command} is not a valid redemption name. This is case sensitive.`
          );
        }
      }
    }
    if (message.toLowerCase().includes("!global25pdiscount")) {
      console.log("50p");
      let docID = tags["user-id"]?.toString();
      if (!docID) return;
      const userData = await getUserData(docID);
      if (!userData) return;
      if (userData.xp > 25000) {
        await updateDoc(doc(db, "users", docID), {
          xp: increment(-25000),
        });
        redemptionsStore.Discount(0.75);
        redemptionsStore.redemptions.forEach((data) => {
          redemptionsStore.updateRedemption(data);
        });
        TMIClient.say(
          "jdudetv",
          `${tags.username} has applied a 25% discount for the next 5 minutes.`
        );
        TMIClient.say(
          "ocefam",
          `${tags.username} You have applied a 25% discount for the next 5 minutes.`
        );
        setTimeout(() => {
          redemptionsStore.Discount(1);
        }, 300000);
      }
    }
    if (message.toLowerCase().includes("!global75pdiscount")) {
      console.log("50p");
      let docID = tags["user-id"]?.toString();
      if (!docID) return;
      const userData = await getUserData(docID);
      if (!userData) return;
      if (userData.xp > 75000) {
        await updateDoc(doc(db, "users", docID), {
          xp: increment(-75000),
        });
        redemptionsStore.Discount(0.25);
        redemptionsStore.redemptions.forEach((data) => {
          redemptionsStore.updateRedemption(data);
        });
        TMIClient.say(
          "jdudetv",
          `${tags.username} has applied a 75% discount for the next 5 minutes.`
        );
        TMIClient.say(
          "ocefam",
          `${tags.username} You have applied a 75% discount for the next 5 minutes.`
        );
        setTimeout(() => {
          redemptionsStore.Discount(1);
        }, 300000);
      }
    }
    if (message.toLowerCase().includes("!timeout")) {
      let docID = tags["user-id"]?.toString();
      if (!docID) return;
      const userData = await getUserData(docID);
      if (!userData) return;
      if (userData.xp > 6900) {
        await updateDoc(doc(db, "users", docID), {
          xp: increment(-6900),
        });
        var usernameforTimeout = message.split(" ");
        if (usernameforTimeout[1].toLowerCase().includes("ocefam")) {
          TMIClient.say(
            "ocefam",
            "/timeout " +
              tags.username +
              " 69 YOU THOUGHT DONT TIMEOUT OCEFAM GDI"
          );
          TMIClient.say(
            "jdudetv",
            "/timeout " +
              tags.username +
              " 69 YOU THOUGHT DONT TIMEOUT OCEFAM GDI"
          );
          return;
        }
        TMIClient.say("ocefam", `${usernameforTimeout[1]} has been timed out!`);
        TMIClient.say(
          "ocefam",
          "/timeout " + usernameforTimeout[1] + " 69 oof"
        );
        TMIClient.say(
          "jdudetv",
          "/timeout " + usernameforTimeout[1] + " 69 oof"
        );
      }
    }
    if (message.toLowerCase().startsWith("?")) {
      if (
        message.toLowerCase().includes("thanossnap") ||
        message.toLowerCase().includes("shoot")
      ) {
        return;
      }
      if (message.toLowerCase().includes("chaos")) {
        let number = localDB.getData("/store/chaostog");
        console.log(number);
        if (number == 0) {
          localDB.push("/store/chaostog", 1);
        } else {
          TMIClient.say(
            "jdudetv",
            "Sorry there are no more Chaos uses this stream. Get more by level 4+ hype trains and Plinko"
          );
          return;
        }
      }
      let Input = message.split(" ");
      let redemption = redemptionsStore.redemptions.get(Input[0].substr(1));
      if (redemption == undefined) {
        TMIClient.say(
          "ocefam",
          `Sorry ${tags.username} That redemption doesn't exsist or is misspelled. Please try again it is case sensitive.`
        );
        return;
      }
      let docID = tags["user-id"]?.toString();
      if (!docID) return;
      const userData = await getUserData(docID);
      if (!userData) return;
      let command = message.substr(Input[0].length + 1);
      console.log(command);
      let name = redemption.title.toLowerCase();
      let XPCOST = Math.round(redemption.defaultcost / 10);
      if (userData.xp > XPCOST) {
        FakeEvent(name, tags.username, command, tags["user-id"]);
        console.log(docID);
        await updateDoc(doc(db, "users", docID), {
          xp: increment(-XPCOST),
        });
      } else {
        TMIClient.say(
          "ocefam",
          `Sorry ${tags.username} you dont have enough Xp for That redemption.`
        );
      }
    }

    return;
  }
  if (message.toLowerCase().includes("bop") && raidToggle == 1) {
    wiggle();
  }
  // if(message.includes("!left")){
  //   rotateanim(-0.1);
  // }
  // if(message.includes("!right")){
  //   rotateanim(0.1);
  // }
  // if(message.includes("!stop")){
  //   rotateStop();
  // }
  if (mods.includes(tags.username) && message.includes("!modme")) {
    TMIClient.mod("jdudetv", tags.username);
  }
  if (tags.username === "jdudetv") {
    if (message.toLowerCase().includes("!discount")) {
      console.log("discount");
      var commandText = message.split(" ");
      redemptionsStore.Discount(parseFloat(commandText[1]));
      redemptionsStore.redemptions.forEach((data) => {
        redemptionsStore.updateRedemption(data);
      });
    }
  }
  if (tags.username != "ocefam" && tags.username != "jdudetv") {
    if (chatters.length <= 9) {
      if (!chatters.includes(tags.username)) {
        if (tags.username) {
          let docID = tags["user-id"]?.toString();
          // let data = await getDoc(doc(db, "users", docID));
          // if (data._document !== null) {
          chatters.push(tags.username.toLowerCase());
          localDB.push("/store/chatters/", chatters);
          let text = "";
          for (let i of chatters) {
            text += `${i} \n`;
          }
          StartingScene.item("Chatters").source.setSettings({
            text: text,
          });
          // }
        }
      }
    }
  }
  if (!mainScene.item("chatWindow").minimised) {
    GenericSound("MSN" + uuidv4(), asset`sounds/message.mp3`);
  }
  if (
    message.toLowerCase().includes("!song") ||
    message.toLowerCase().includes("!music") ||
    message.toLowerCase().includes("!currentsong") ||
    message.toLowerCase().includes("!currentlyplaying")
  ) {
    CurrSong();
  }
  if (TTSingChat === 1) TTSFunction(message);
  if (message === "!start") {
    if (!mainScene.item("StartMenu").enabled) toggleStartMenu();
  }
  if (message.includes("!hydrate")) {
    if (waterCooldown === 0) {
      waterCooldown = 1;
      GenericSound("drinkup", asset`sounds/wouder.mp3`);
      setTimeout(() => {
        waterCooldown = 0;
      }, 30000);
    }
  }
  if (message.includes("!timeout")) {
    let docID = tags["user-id"]?.toString();
    if (!docID) return;
    const userData = await getUserData(docID);
    if (!userData) return;
    if (userData.timeouts > 0) {
      var usernameforTimeout = message.split(" ");
      if (usernameforTimeout[1].toLowerCase().includes("ocefam")) {
        TMIClient.say(
          "jdudetv",
          "/timeout " +
            tags.username +
            " 69 YOU THOUGHT DONT TIMEOUT OCEFAM GDI"
        );
        await updateDoc(doc(db, "users", docID), {
          timeouts: increment(-1),
        });
        return;
      }
      TMIClient.say("jdudetv", "/timeout " + usernameforTimeout[1] + " 69 oof");
      await updateDoc(doc(db, "users", docID), {
        timeouts: increment(-1),
      });
    } else {
      TMIClient.say(
        "jdudetv",
        `Sorry ${tags.username} You dont have any timeout tokens left`
      );
    }
  }
  let spaced = message + " ";
  if (spaced.toLowerCase().startsWith("yo ") && channel === "#jdudetv") {
    if (yoObject.cooldown > 0) {
      TMIClient.say("jdudetv", "/timeout " + tags.username + " 69");
    } else {
      yoObject.cooldown = Math.round(Math.random() * 120);
      yoObject.yoCount++;
      TMIClient.say("jdudetv", "Yo x " + yoObject.yoCount);
    }
    localDB.push("/store/yoStore", yoObject);
  }
});
