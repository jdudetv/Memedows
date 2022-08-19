import { observer } from "mobx-react-lite";
import React, { useEffect, useRef } from "react";

import Taskbar from "./Taskbar";
import ChatWindow from "./Windows/ChatWindow";
import StreamWindow from "./Windows/StreamWindow";
import StartMenu from "./StartMenu";

import { store } from "../data";
import Preloader from "./Preloader";
import MediaWindow from "./Windows/MediaWindow";
import INFO from "./Windows/INFO";
import CommandsChat from "./Windows/commandchat";

const App = observer(() => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    store.windows.setInitialPositions();
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden relative flex flex-col select-none">
      <Preloader />
      <img
        className="absolute object-cover w-full h-full"
        src="/MainPageBackground_Bliss.jpg"
        alt="background"
      />
      <div className="flex-1 relative" ref={containerRef}>
        <ChatWindow />
        <StreamWindow />
        <MediaWindow />
        <StartMenu />
        <CommandsChat />
        <INFO />
      </div>
      <Taskbar />
      <div className="text-2xl flex w-screen absolute h-screen bg-white z-50 md:hidden lg:hidden">
        <div className="m-auto">Sorry this only supports desktop currently</div>
      </div>
    </div>
  );
});

export default App;
