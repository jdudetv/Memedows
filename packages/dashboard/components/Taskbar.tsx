import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { store } from "../data";

const Taskbar = () => {
  const [, setTicker] = useState(0);

  useEffect(() => {
    setInterval(() => setTicker((t) => t + 1), 1000);
  }, []);

  return (
    <div className="w-full relative flex flex-row justify-between h-10 z-10">
      <img
        className="w-full absolute l-0 r-0 h-10"
        src="/TaskbarBackground.jpg"
        alt="center taskbar"
      />
      <img
        className="z-10 h-10 StartButton cursor-pointer"
        src="/TaskbarBottomLeft.png"
        alt="left taskbar"
        onClick={() => (store.ui.startMenuVisible = true)}
      />
      <div className="z-10 h-10 relative">
        <p className="absolute right-6 top-1.5 text-2xl text-white" style={{}}>
          {dayjs().format("HH:mm:ss")}
        </p>
        <img src="/TaskbarBottomRight.jpg" alt="right taskbar" />
      </div>
    </div>
  );
};

export default Taskbar;
