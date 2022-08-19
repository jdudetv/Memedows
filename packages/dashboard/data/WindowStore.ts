import { action, observable } from "mobx";
import { store } from ".";

export interface Bounds {
  x: any;
  y: any;
  width: any;
  height: any;
}

export function resetLayout() {
  localStorage.removeItem("Stream");
  localStorage.removeItem("Explorer");
  localStorage.removeItem("Chat");
  localStorage.removeItem("INFO");
  localStorage.removeItem("CommandsChat");

  store.windows.setInitialPositions();
}

export class WindowStore {
  @observable windowBounds = new Map<string, Bounds>();

  @observable windowFocus: string[] = [];

  @action
  bringToFront(window: string) {
    this.windowFocus.splice(this.windowFocus.indexOf(window), 1);
    this.windowFocus = this.windowFocus.concat([window]);
  }

  @action
  setInitialPositions() {
    const Stream = JSON.parse(localStorage.getItem("Stream"));
    const Explorer = JSON.parse(localStorage.getItem("Explorer"));
    const CommandsChat = JSON.parse(localStorage.getItem("CommandsChat"));
    const Chat = JSON.parse(localStorage.getItem("Chat"));
    const INFO = JSON.parse(localStorage.getItem("INFO"));
    const width = window.innerWidth,
      height = window.innerHeight - 40;

    const windowPadding = height * 0.02;
    console.log(Stream);
    const twitchPlayerHeight = (height * 2) / 3;
    const twitchPlayerWidth = (twitchPlayerHeight * 16) / 9;
    const twitchPlayerX = (width - twitchPlayerWidth) / 2;
    const twitchPlayerY = windowPadding;

    if (INFO === null) {
      this.windowBounds.set("INFO", {
        x: windowPadding,
        y: height / 2 + windowPadding,
        width: width - (twitchPlayerX + twitchPlayerWidth + 2 * windowPadding),
        height: height / 2 - 2 * windowPadding,
      });
    } else {
      this.windowBounds.set("INFO", {
        x: INFO.x,
        y: INFO.y,
        width: INFO.width,
        height: INFO.height,
      });
    }

    if (CommandsChat === null) {
      this.windowBounds.set("CommandsChat", {
        x: windowPadding,
        y: windowPadding,
        width: width - (twitchPlayerX + twitchPlayerWidth + 2 * windowPadding),
        height: height / 2 - windowPadding,
      });
    } else {
      this.windowBounds.set("CommandsChat", {
        x: CommandsChat.x,
        y: CommandsChat.y,
        width: CommandsChat.width,
        height: CommandsChat.height,
      });
    }

    if (Stream === null) {
      this.windowBounds.set("Stream", {
        x: twitchPlayerX,
        y: twitchPlayerY,
        width: twitchPlayerWidth,
        height: twitchPlayerHeight + 30,
      });
    } else {
      this.windowBounds.set("Stream", {
        x: Stream.x,
        y: Stream.y,
        width: Stream.width,
        height: Stream.height,
      });
    }

    if (Chat === null) {
      this.windowBounds.set("Chat", {
        x: twitchPlayerX + twitchPlayerWidth + windowPadding,
        y: twitchPlayerY,
        width: width - (twitchPlayerX + twitchPlayerWidth + 2 * windowPadding),
        height: height - 2 * windowPadding,
      });
    } else {
      this.windowBounds.set("Chat", {
        x: Chat.x,
        y: Chat.y,
        width: Chat.width,
        height: Chat.height,
      });
    }

    if (Explorer === null) {
      this.windowBounds.set("Explorer", {
        x: twitchPlayerX,
        y: twitchPlayerY + twitchPlayerHeight + 2 * windowPadding,
        width: twitchPlayerWidth,
        height: height - (twitchPlayerHeight + 4 * windowPadding),
      });
    } else {
      this.windowBounds.set("Explorer", {
        x: Explorer.x,
        y: Explorer.y,
        width: Explorer.width,
        height: Explorer.height,
      });
    }
  }
}
