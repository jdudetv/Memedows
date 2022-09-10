import Taskbar from "./Taskbar";
import StartMenu from "./StartMenu";
import BlissBackground from "../assets/MainPageBackground_Bliss.jpg";

import ChatWindow from "./Windows/ChatWindow";
import StreamWindow from "./Windows/StreamWindow";
import MediaWindow from "./Windows/MediaWindow";
import INFO from "./Windows/INFO";
import CommandsChat from "./Windows/commandchat";

export default () => {
  return (
    <div class="w-screen h-screen overflow-hidden relative flex flex-col select-none">
      <img
        class="absolute object-cover w-full h-full"
        src={BlissBackground}
        alt="background"
      />
      <div class="flex-1 relative">
        <ChatWindow />
        <StreamWindow />
        <MediaWindow />
        <StartMenu />
        <CommandsChat />
        <INFO />
      </div>
      <Taskbar />
      <div class="text-2xl flex w-screen absolute h-screen bg-white z-50 md:hidden lg:hidden">
        <div class="m-auto">Sorry this only supports desktop currently</div>
      </div>
    </div>
  );
};
