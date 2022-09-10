import { createSignal, For } from "solid-js";
import { Dynamic } from "solid-js/web";
import clsx from "clsx";

import Icon from "../../assets/emblem-web.png";
import Window from "../Window";
import { routes } from "./routes";

const INFO = () => {
  const [route, setRoute] = createSignal<keyof typeof routes>("FAQ");

  return (
    <Window name="Info" imageSrc={Icon}>
      <div class="h-full flex flex-col">
        <div class="bg-gray-800 w-full text-white flex flex-row flex-wrap">
          <For each={Object.keys(routes)}>
            {(title) => (
              <span
                class={clsx(
                  "px-2 py-1 font-bold cursor-pointer",
                  title === route() && "bg-gray-500"
                )}
                onClick={() => setRoute(title as any)}
              >
                {title}
              </span>
            )}
          </For>
        </div>
        <div class="flex-1 flex-col h-full overflow-y-auto">
          <Dynamic component={routes[route()]} />
        </div>
      </div>
    </Window>
  );
};

export default INFO;
