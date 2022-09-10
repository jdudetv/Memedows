import clsx from "clsx";
import { For, Show } from "solid-js";
import { user } from "../../../utils";

let XPRedempts = [
  {
    name: "XPGroup",
    cost: 1000,
    Desc: "Enter a name after the command to toggle the currently active group of redemptions.",
  },
  {
    name: "Timeout",
    cost: 6900,
    Desc: "Enter someones username after the command to time them out for 69 seconds.",
  },
  {
    name: "EmoteOnly",
    cost: 5000,
    Desc: "Turn on emote only mode for 2 minutes",
  },
  {
    name: "50PDiscount",
    cost: 5000,
    Desc: "Enter a redemption name after the command to discount it by 50% for 5 minutes",
  },
  {
    name: "Global25PDiscount",
    cost: 25000,
    Desc: "Discounts all Redemptions by 25% for 5 minutes.",
  },
  {
    name: "Global50PDiscount",
    cost: 50000,
    Desc: "Discounts all Redemptions by 50% for 5 minutes.",
  },
  {
    name: "TTSCHAT",
    cost: 10000,
    Desc: "Chat will TTS all messages for the next 30s.",
  },
  {
    name: "Global75PDiscount",
    cost: 75000,
    Desc: "Discounts all Redemptions by 75% for 5 minutes.",
  },
  {
    name: "RecommendRaid",
    cost: 10000,
    Desc: "Recommend a channel for us to raid at the end of stream.",
  },
  {
    name: "VIP",
    cost: 10000,
    Desc: "Get VIP for the stream.",
  },
  {
    name: "[name of redemption]",
    cost: 10000,
    Desc: "Put the redemption name after a ! (!Yeet) and it will redeem it.  Even if its turned off in redemptions. Cost is 90% off of channel points.",
  },
].sort((a, b) => a.cost - b.cost);

const XPCommands = () => {
  return (
    <div class="flex flex-col h-full overflow-y-auto">
      <div class="border-b border-black relative ">
        <span class="w-full flex flex-row items-stretch font-bold text-3xl pb-2 justify-center pl-2 p-0.5">
          <Show when={user()} fallback={"Please Login"}>
            {(u) => `${u.xp.toLocaleString("en-US")} xp`}
          </Show>
        </span>
      </div>
      <div class="flex-1 overflow-y-auto">
        <div class="min-h-full h-full flex flex-row flex-wrap content-start divide-y-2 divide-black">
          <For each={XPRedempts.sort((a, b) => a.cost - b.cost)}>
            {(r) => {
              let colourClass = undefined;

              if (user())
                colourClass =
                  user()!.xp > r.cost ? "bg-green-300" : "bg-red-300";

              return (
                <div class={clsx("py-2 w-full h-auto", colourClass)}>
                  <div class="mx-2 text-2xl font-bold">
                    !{r.name} - {r.cost}xp
                  </div>
                  <div class="mx-2 text-lg">{r.Desc}</div>
                </div>
              );
            }}
          </For>
        </div>
      </div>
    </div>
  );
};

export default XPCommands;
