import { time } from "console";
import { EventEmitter2 } from "eventemitter2";
import * as ws from "ws";
import { redemptionEmitter } from "~/data/handlers/redemptions/base";
import { localDB } from "../jsondb";
import { TMIClient } from "./emotes";

const PORT = 1234;

export function initPixels() {
  const server = new ws.Server({
    port: PORT,
  });

  let PixelArray = localDB.getData("/store/pixels");

  server.on("connection", (socket: any) => {
    console.log("pixels connected");
    PixelArray.forEach((pixels) => {
      server.clients.forEach(function each(client) {
        client.send(JSON.stringify(pixels));
      });
    });
  });

  TMIClient.on("message", async (channel, tags, message, self) => {
    if (message.includes("!pixel")) {
      if (message.includes("null")) return;
      if (message.includes("undefined")) return;
      var splitMessage = message.split(" ");
      let x = splitMessage[1];
      let y = splitMessage[2];
      if (Number(x) !== 0) {
        if (!Number(x)) return;
      }
      if (Number(y) !== 0) {
        if (!Number(y)) return;
      }
      if (Number(x) > 480) return;
      if (Number(y) > 270) return;
      let color = splitMessage[3];
      let packet = { x, y, color };
      PixelArray.push(packet);
      localDB.push("/store/pixels/", PixelArray);
      server.clients.forEach(function each(client) {
        client.send(JSON.stringify(packet));
      });
    }
  });
}
