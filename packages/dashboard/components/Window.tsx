import { useRef, RefObject, useCallback } from "react";
import { observer } from "mobx-react-lite";
import { runInAction } from "mobx";

import { store } from "../data";

let minWidth = 300;

let initx: number;
let inity: number;
let initwidth: number;
let initheight: number;

interface Props {
  data: {
    name: string;
    ref: RefObject<HTMLDivElement>;
  };
  children: React.ReactNode;
  imageSrc?: string;
  className?: string;
}

const Window = observer(
  ({ data: { ref, name }, children, className, imageSrc }: Props) => {
    const bounds = store.windows.windowBounds.get(name);
    const mouseDownPos = useRef<number[] | null>(null);
    const mouseMovePos = useRef<number[] | null>(null);

    const mouseCallback = useCallback(
      (e: MouseEvent) => {
        if (mouseDownPos.current !== null) {
          const offset = mouseDownPos.current;
          if (!bounds) return;
          ("");

          runInAction(() => {
            localStorage.setItem(`${name}`, JSON.stringify(bounds));
            bounds.x = e.clientX - offset[0];
            bounds.y = e.clientY - offset[1];
          });
        }
      },
      [bounds]
    );

    const resizeCallbackBL = useCallback(
      (e: MouseEvent) => {
        if (mouseMovePos.current !== null) {
          const offset = mouseMovePos.current;
          if (!bounds) return;

          console.log(offset[0]);

          runInAction(() => {
            localStorage.setItem(`${name}`, JSON.stringify(bounds));
            bounds.width = Math.max(initwidth - (offset[0] - initx), minWidth);
            bounds.x = Math.min(offset[0], initwidth + initx - minWidth);
            bounds.height = Math.max(offset[1], minWidth);
          });

          mouseMovePos.current = [e.clientX, e.clientY - bounds.y];
        }
      },
      [bounds]
    );

    const resizeCallbackTL = useCallback(
      (e: MouseEvent) => {
        if (mouseMovePos.current !== null) {
          const offset = mouseMovePos.current;
          if (!bounds) return;

          console.log(offset[0]);

          runInAction(() => {
            localStorage.setItem(`${name}`, JSON.stringify(bounds));
            bounds.width = Math.max(initwidth - (offset[0] - initx), minWidth);
            bounds.x = Math.min(offset[0], initwidth + initx - minWidth);
            bounds.y = Math.min(offset[1], initheight + inity - minWidth);
            bounds.height = Math.max(
              initheight - (offset[1] - inity),
              minWidth
            );
          });

          mouseMovePos.current = [e.clientX, e.clientY];
        }
      },
      [bounds]
    );

    const resizeCallbackTR = useCallback(
      (e: MouseEvent) => {
        if (mouseMovePos.current !== null) {
          const offset = mouseMovePos.current;
          if (!bounds) return;

          console.log(offset[0]);

          runInAction(() => {
            localStorage.setItem(`${name}`, JSON.stringify(bounds));
            bounds.width = Math.max(offset[0], minWidth);
            bounds.y = Math.min(offset[1], initheight + inity - minWidth);
            bounds.height = Math.max(
              initheight - (offset[1] - inity),
              minWidth
            );
          });

          mouseMovePos.current = [e.clientX - bounds.x, e.clientY];
        }
      },
      [bounds]
    );

    const resizeCallbackBR = useCallback(
      (e: MouseEvent) => {
        if (mouseMovePos.current !== null) {
          const offset = mouseMovePos.current;
          if (!bounds) return;

          runInAction(() => {
            localStorage.setItem(`${name}`, JSON.stringify(bounds));
            bounds.width = Math.max(offset[0], minWidth);
            bounds.height = Math.max(offset[1], minWidth);
          });

          mouseMovePos.current = [e.clientX - bounds.x, e.clientY - bounds.y];
        }
      },
      [bounds]
    );

    if (!bounds) return null;
    const x = bounds.x;
    const y = bounds.y;

    return (
      <div
        ref={ref}
        style={{
          position: "absolute",
          width: bounds.width,
          height: bounds.height,
          transform: `translate(${x}px, ${y}px)`,
          zIndex: store.windows.windowFocus.indexOf(name),
        }}
        className="flex flex-col rounded-tl-md rounded-tr-md overflow-hidden"
      >
        <div
          className="relative w-full h-7 cursor-pointer flex flex-row text-lg pb-0.5 pl-2"
          onMouseDown={(e) => {
            store.windows.bringToFront(name);
            e.stopPropagation();
            store.ui.coverWindow = true;
            window.addEventListener("mousemove", mouseCallback);
            mouseDownPos.current = [e.clientX - bounds.x, e.clientY - bounds.y];

            const upListener = () => {
              store.ui.coverWindow = false;
              window.removeEventListener("mousemove", mouseCallback);
              mouseDownPos.current = null;
              window.removeEventListener("mouseup", upListener);
            };

            window.addEventListener("mouseup", upListener);
          }}
        >
          <div className="z-10 space-x-1 flex flex-row items-center">
            <img
              alt="window icon"
              className="object-contain -mb-1 h-full"
              src={imageSrc}
            />
            <h1
              className="text-white font-thin font-trebuchet mt-0.5"
              style={{ textShadow: "1px 1px black" }}
            >
              {name}
            </h1>
          </div>
          <div className="TaskBarGradient absolute inset-0" />
        </div>
        <div className="w-full flex-1 flex flex-row overflow-hidden">
          <div className="h-full w-0.5 EdgeColour"></div>
          <div className={"h-full flex-1 bg-white " + className ?? ""}>
            {children}
            {store.ui.coverWindow && <div className="absolute inset-0"></div>}
          </div>
          <div className="wh-full w-0.5 EdgeColour"></div>
        </div>
        <div className="w-full h-0.5 EdgeColour">
          <img
            className="absolute -right-0.5 top-0 h-7"
            src="/TopRightUi.png"
            alt="Windows UI elements for closing and reopening windows"
          />
          <div
            className="absolute left-0 top-0 w-4 h-4 bg-transparent"
            style={{ cursor: "nwse-resize" }}
            onMouseDown={(e) => {
              initx = bounds.x;
              inity = bounds.y;
              initheight = bounds.height;
              initwidth = bounds.width;
              store.ui.coverWindow = true;
              e.stopPropagation();
              window.addEventListener("mousemove", resizeCallbackTL);
              mouseMovePos.current = [e.clientX, e.clientY];

              const upListener = (e: MouseEvent) => {
                store.ui.coverWindow = false;
                e.stopPropagation();
                window.removeEventListener("mousemove", resizeCallbackTL);
                mouseDownPos.current = null;
                window.removeEventListener("mouseup", upListener);
              };

              window.addEventListener("mouseup", upListener);
            }}
          ></div>
          <div
            className="absolute right-0 top-0 w-4 h-4 bg-transparent"
            style={{ cursor: "nesw-resize" }}
            onMouseDown={(e) => {
              initx = bounds.x;
              inity = bounds.y;
              initheight = bounds.height;
              initwidth = bounds.width;
              store.ui.coverWindow = true;
              e.stopPropagation();
              window.addEventListener("mousemove", resizeCallbackTR);
              mouseMovePos.current = [e.clientX - bounds.x, e.clientY];

              const upListener = (e: MouseEvent) => {
                store.ui.coverWindow = false;
                e.stopPropagation();
                window.removeEventListener("mousemove", resizeCallbackTR);
                mouseDownPos.current = null;
                window.removeEventListener("mouseup", upListener);
              };

              window.addEventListener("mouseup", upListener);
            }}
          ></div>
          <div
            className="absolute left-0 bottom-0 w-4 h-4 bg-transparent"
            style={{ cursor: "nesw-resize" }}
            onMouseDown={(e) => {
              initx = bounds.x;
              inity = bounds.y;
              initheight = bounds.height;
              initwidth = bounds.width;
              store.ui.coverWindow = true;
              e.stopPropagation();
              window.addEventListener("mousemove", resizeCallbackBL);
              mouseMovePos.current = [e.clientX, e.clientY - bounds.y];

              const upListener = (e: MouseEvent) => {
                store.ui.coverWindow = false;
                e.stopPropagation();
                window.removeEventListener("mousemove", resizeCallbackBL);
                mouseDownPos.current = null;
                window.removeEventListener("mouseup", upListener);
              };

              window.addEventListener("mouseup", upListener);
            }}
          ></div>
          <div
            className="absolute right-0 bottom-0 w-4 h-4 bg-transparent"
            style={{ cursor: "nwse-resize" }}
            onMouseDown={(e) => {
              store.ui.coverWindow = true;
              e.stopPropagation();
              window.addEventListener("mousemove", resizeCallbackBR);
              mouseMovePos.current = [
                e.clientX - bounds.x,
                e.clientY - bounds.y,
              ];

              const upListener = (e: MouseEvent) => {
                store.ui.coverWindow = false;
                e.stopPropagation();
                window.removeEventListener("mousemove", resizeCallbackBR);
                mouseDownPos.current = null;
                window.removeEventListener("mouseup", upListener);
              };

              window.addEventListener("mouseup", upListener);
            }}
          ></div>
        </div>
      </div>
    );
  }
);

export default Window;
