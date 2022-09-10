import dayjs from "dayjs";
import { createSignal } from "solid-js";

import { toggleStartMenuVisible } from "../stores/ui";
import TaskbarBottomRightImg from "../assets/TaskbarBottomRight.jpg";
import TaskbarBottomLeftImg from "../assets/TaskbarBottomLeft.jpg";
import TaskbarBackgroundImg from "../assets/TaskbarBackground.jpg";

function formatTime() {
  return dayjs().format("HH:mm:ss");
}

const Taskbar = () => {
  const [time, setTime] = createSignal(formatTime());

  setInterval(() => setTime(formatTime()), 1000);

  return (
    <div class="w-full relative flex flex-row justify-between h-10 z-10">
      <img
        class="w-full absolute l-0 r-0 h-10"
        src={TaskbarBackgroundImg}
        alt="center taskbar"
      />
      <img
        class="z-10 h-10 StartButton cursor-pointer"
        src={TaskbarBottomLeftImg}
        alt="left taskbar"
        onClick={() => toggleStartMenuVisible()}
      />
      <div class="z-10 h-10 relative">
        <p class="absolute right-6 top-1.5 text-2xl text-white" style={{}}>
          {time()}
        </p>
        <img src={TaskbarBottomRightImg} alt="right taskbar" />
      </div>
    </div>
  );
};

export default Taskbar;
