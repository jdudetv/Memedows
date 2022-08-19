import { EventEmitter2 } from "eventemitter2";
import * as ws from "ws";
import { redemptionEmitter } from "~/data/handlers/redemptions/base";

const PORT = 1337;

const server = new ws.Server({
  port: PORT,
});

interface StreamdeckWebsocketMessage {
  action: "org.tynsoe.streamdeck.wsproxy.proxy";
  context: string;
  device: string;
  event: "willAppear" | "willDisappear" | "keyDown" | "keyUp";
  payload: {
    coordinates: {
      column: number;
      row: number;
    };
    isInMultiAction: boolean;
    settings: {
      id: string;
      remoteServer: string;
    };
  };
}

export const streamdeckEmitter = new EventEmitter2();

server.on("connection", (socket: any) => {
  console.log("streamdeck connected");
  socket.on("message", async (rawData: any) => {
    const data = JSON.parse(rawData.toString()) as StreamdeckWebsocketMessage;
    await streamdeckEmitter.emitAsync(
      `${data.event}:${data.payload.settings.id}`
    );
  });
});
