import { createMemo, createSignal } from "solid-js";

import TopRightImg from "../assets/TopRightUi.png";
import { toggleCoverWindow, uiStore } from "../stores/ui";
import {
  bringToFront,
  createWindow,
  DEFAULT_WINDOW_BOUNDS,
  updateBounds,
  windowStore,
} from "../stores/windows";

let minWidth = 300;

let initx: number;
let inity: number;
let initwidth: number;
let initheight: number;

interface Props {
  name: keyof typeof DEFAULT_WINDOW_BOUNDS;
  children: any;
  imageSrc?: string;
  class?: string;
}

interface Position {
  x: number;
  y: number;
}

const Window = ({ name, children, imageSrc, ...props }: Props) => {
  const windowData = createWindow(name);

  const index = createMemo(() => {
    return windowStore.findIndex((w) => w.name === name);
  });

  const bounds = windowData.bounds;

  const [mouseDownPos, setMouseDownPos] = createSignal<Position | null>(null);
  const [mouseMovePos, setMouseMovePos] = createSignal<Position | null>(null);

  const mouseCallback = (e: MouseEvent) => {
    const pos = mouseDownPos();
    if (pos && windowData.bounds) {
      localStorage.setItem(`${name}`, JSON.stringify(bounds));
      updateBounds(name, {
        x: e.clientX - pos.x,
        y: e.clientY - pos.y,
      });
    }
  };

  const resizeCallbackBL = (e: MouseEvent) => {
    let pos = mouseMovePos();
    if (pos && bounds) {
      localStorage.setItem(`${name}`, JSON.stringify(bounds));

      updateBounds(name, {
        width: Math.max(initwidth - (pos.x - initx), minWidth),
        height: Math.max(pos.y, minWidth),
        x: Math.min(pos.x, initwidth + initx - minWidth),
      });

      setMouseMovePos({
        x: e.clientX,
        y: e.clientY - bounds.y,
      });
    }
  };

  const resizeCallbackTL = (e: MouseEvent) => {
    const pos = mouseMovePos();
    if (pos && bounds) {
      localStorage.setItem(`${name}`, JSON.stringify(bounds));

      updateBounds(name, {
        width: Math.max(initwidth - (pos.x - initx), minWidth),
        x: Math.min(pos.x, initwidth + initx - minWidth),
        y: Math.min(pos.y, initheight + inity - minWidth),
        height: Math.max(initheight - (pos.y - inity), minWidth),
      });

      setMouseMovePos({
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  const resizeCallbackTR = (e: MouseEvent) => {
    const pos = mouseMovePos();
    if (pos && bounds) {
      localStorage.setItem(`${name}`, JSON.stringify(bounds));

      updateBounds(name, {
        width: Math.max(pos.x, minWidth),
        y: Math.min(pos.y, initheight + inity - minWidth),
        height: Math.max(initheight - (pos.y - inity), minWidth),
      });

      setMouseMovePos({
        x: e.clientX - bounds.x,
        y: e.clientY,
      });
    }
  };

  const resizeCallbackBR = (e: MouseEvent) => {
    const pos = mouseMovePos();
    if (pos && bounds) {
      localStorage.setItem(`${name}`, JSON.stringify(bounds));

      updateBounds(name, {
        width: Math.max(pos.x, minWidth),
        height: Math.max(pos.y, minWidth),
      });

      setMouseMovePos({
        x: e.clientX - bounds.x,
        y: e.clientY - bounds.y,
      });
    }
  };

  if (!bounds) return null;

  return (
    <div
      style={{
        width: `${bounds.width}px`,
        height: `${bounds.height}px`,
        transform: `translate(${bounds.x}px, ${bounds.y}px)`,
        "z-index": index(),
      }}
      class="absolute flex flex-col rounded-tl-md rounded-tr-md overflow-hidden"
    >
      <div
        class="relative w-full h-7 cursor-pointer flex flex-row text-lg pb-0.5 pl-2"
        onMouseDown={(e) => {
          bringToFront(name);
          e.stopPropagation();
          toggleCoverWindow(true);
          window.addEventListener("mousemove", mouseCallback);
          setMouseDownPos({
            x: e.clientX - bounds.x,
            y: e.clientY - bounds.y,
          });

          const upListener = () => {
            toggleCoverWindow(false);
            window.removeEventListener("mousemove", mouseCallback);
            setMouseDownPos(null);
            window.removeEventListener("mouseup", upListener);
          };

          window.addEventListener("mouseup", upListener);
        }}
      >
        <div class="z-10 space-x-1 flex flex-row items-center">
          <img
            alt="window icon"
            class="object-contain -mb-1 h-full"
            src={imageSrc}
          />
          <h1
            class="text-white font-thin font-trebuchet mt-0.5"
            style={{ textShadow: "1px 1px black" }}
          >
            {name}
          </h1>
        </div>
        <div class="TaskBarGradient absolute inset-0" />
      </div>
      <div class="w-full flex-1 flex flex-row items-stretch overflow-hidden">
        <div class="w-0.5 EdgeColour"></div>
        <div class={"h-full flex-1 bg-white " + props.class ?? ""}>
          {children}
          {uiStore.coverWindow && <div class="absolute inset-0"></div>}
        </div>
        <div class="w-0.5 EdgeColour"></div>
      </div>
      <div class="w-full h-0.5 EdgeColour">
        <img
          class="absolute -right-0.5 top-0 h-7"
          src={TopRightImg}
          alt="Windows UI elements for closing and reopening windows"
        />
        <div
          class="absolute left-0 top-0 w-4 h-4 bg-transparent"
          style={{ cursor: "nwse-resize" }}
          onMouseDown={(e) => {
            initx = bounds.x;
            inity = bounds.y;
            initheight = bounds.height;
            initwidth = bounds.width;
            toggleCoverWindow(true);
            e.stopPropagation();
            window.addEventListener("mousemove", resizeCallbackTL);
            setMouseMovePos({
              x: e.clientX,
              y: e.clientY,
            });

            const upListener = (e: MouseEvent) => {
              toggleCoverWindow(false);
              e.stopPropagation();
              window.removeEventListener("mousemove", resizeCallbackTL);
              setMouseDownPos(null);
              window.removeEventListener("mouseup", upListener);
            };

            window.addEventListener("mouseup", upListener);
          }}
        ></div>
        <div
          class="absolute right-0 top-0 w-4 h-4 bg-transparent"
          style={{ cursor: "nesw-resize" }}
          onMouseDown={(e) => {
            initx = bounds.x;
            inity = bounds.y;
            initheight = bounds.height;
            initwidth = bounds.width;
            toggleCoverWindow(true);
            e.stopPropagation();
            window.addEventListener("mousemove", resizeCallbackTR);
            setMouseMovePos({
              x: e.clientX - bounds.x,
              y: e.clientY,
            });

            const upListener = (e: MouseEvent) => {
              toggleCoverWindow(false);
              e.stopPropagation();
              window.removeEventListener("mousemove", resizeCallbackTR);
              setMouseDownPos(null);
              window.removeEventListener("mouseup", upListener);
            };

            window.addEventListener("mouseup", upListener);
          }}
        ></div>
        <div
          class="absolute left-0 bottom-0 w-4 h-4 bg-transparent"
          style={{ cursor: "nesw-resize" }}
          onMouseDown={(e) => {
            initx = bounds.x;
            inity = bounds.y;
            initheight = bounds.height;
            initwidth = bounds.width;
            toggleCoverWindow(true);
            e.stopPropagation();
            window.addEventListener("mousemove", resizeCallbackBL);
            setMouseMovePos({
              x: e.clientX,
              y: e.clientY - bounds.y,
            });

            const upListener = (e: MouseEvent) => {
              toggleCoverWindow(false);
              e.stopPropagation();
              window.removeEventListener("mousemove", resizeCallbackBL);
              setMouseDownPos(null);
              window.removeEventListener("mouseup", upListener);
            };

            window.addEventListener("mouseup", upListener);
          }}
        ></div>
        <div
          class="absolute right-0 bottom-0 w-4 h-4 bg-transparent"
          style={{ cursor: "nwse-resize" }}
          onMouseDown={(e) => {
            toggleCoverWindow(true);
            e.stopPropagation();
            window.addEventListener("mousemove", resizeCallbackBR);
            setMouseMovePos({
              x: e.clientX - bounds.x,
              y: e.clientY - bounds.y,
            });

            const upListener = (e: MouseEvent) => {
              toggleCoverWindow(false);
              e.stopPropagation();
              window.removeEventListener("mousemove", resizeCallbackBR);
              setMouseDownPos(null);
              window.removeEventListener("mouseup", upListener);
            };

            window.addEventListener("mouseup", upListener);
          }}
        ></div>
      </div>
    </div>
  );
};

export default Window;
