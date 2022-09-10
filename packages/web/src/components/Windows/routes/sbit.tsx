import clsx from "clsx";
import { For } from "solid-js";

import { createQuery } from "../../../utils/trpc";

const Sbit = () => {
  const secretBits = createQuery(["secretBits"], { refetchInterval: 5000 });

  return (
    <div class="flex flex-row flex-wrap">
      <For each={secretBits.data ?? []}>
        {(bit) => (
          <div
            class={clsx(
              "w-1/10 h-1/10 text-2xl font-bold text-center py-1 items-center align-middle border-2 border-black",
              bit.state ? "text-red-500 pt-0 font-black text-3xl" : "text-black"
            )}
          >
            {bit.state ? "X" : bit.bit}
          </div>
        )}
      </For>
    </div>
  );
};

export default Sbit;
