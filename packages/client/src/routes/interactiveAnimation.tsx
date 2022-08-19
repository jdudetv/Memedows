import { useRef } from "react";
import { mainScene } from "~/obs/Main";
import { getBody, unregisterPhysicsItem } from "~/obs/physics";
import { WindowItem } from "~/obs/Window";

let prevPovx = 0;
let prevPovy = 0;

let xFull = 0;
let yFull = 0;

let Scale = 0.25;
let prevScale = 0.25;

let ClickDown = 0;
//movement sensitivity ( higher = slower )
let Sensitivity = 15;

setInterval(() => {
  if (!ClickDown) return;
  if (
    Math.round(prevPovx) !== Math.round(xFull) ||
    Math.round(prevPovy) !== Math.round(yFull) ||
    Scale != prevScale
  ) {
    let dx = xFull - prevPovx;
    let dy = yFull - prevPovy;

    prevPovx += dx / Sensitivity;
    prevPovy += dy / Sensitivity;

    mainScene.item("cameraWindow").setTransform({
      positionX: prevPovx,
      positionY: prevPovy,
      scaleX: Scale,
      scaleY: Scale,
      rotation: dx / 30,
    });
  }
}, 16);

const InteractiveAnimation = () => {
  const ref = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      onMouseDown={(e) => {
        unregisterPhysicsItem(mainScene.item("cameraWindow"));
        ClickDown = 1;
      }}
      onMouseUp={(e) => {
        if (e.button == 0) {
          (mainScene.item("cameraWindow") as WindowItem<any>).registerPhysics();
          let dx = xFull - prevPovx;
          let dy = yFull - prevPovy;

          const body = getBody(mainScene.item("cameraWindow"))!;
          body.velocity = [dx * 4, dy * 4];
          body.angularVelocity = dx / 150;
        }
        ClickDown = 0;
      }}
      onWheel={(e) => {
        if (ClickDown == 0) return;
        prevScale = Scale;
        if (e.deltaY < 0) {
          Scale += 0.01;
        } else {
          Scale -= 0.01;
        }
      }}
      onMouseMove={(e) => {
        if (ClickDown == 0) return;

        const bounds = ref.current!.getBoundingClientRect();

        const x = e.clientX - bounds.x,
          y = e.clientY - bounds.y;

        xFull = 1920 * (x / bounds.width);
        yFull = 1080 * (y / bounds.height);

        if (prevPovx == 0 && prevPovy == 0) {
          prevPovx = xFull;
          prevPovy = yFull;
        }
      }}
      className="bg-gray-800 w-full flex items-center justify-center text-5xl font-black text-white"
      style={{ paddingTop: "56.25%" }}
    />
  );
};

export default InteractiveAnimation;
