import { Accessor, createMemo, createSignal, For, Suspense } from "solid-js";
import { prisma } from "@memedows/api";

import Window from "../../Window";
import Dropdown from "./Dropdown";
import { createQuery } from "../../../utils/trpc";
import Icon from "../../../assets/folder-visiting.png";

interface ContentsProps {
  tab: Accessor<prisma.MediaType>;
}
const Contents = (props: ContentsProps) => {
  const media = createQuery(["media"]);

  const items = createMemo(() => {
    return (media.data?.[props.tab()] ?? []).sort();
  });

  return (
    <For each={items()}>
      {(data) => (
        <div class="text-left mt-2 mx-1 flex flex-row items-center text-black w-48 text-sm break-words space-x-2 last:mb-2">
          {/* TODO: use supabase storage and item id */}
          {/* <img */}
          {/*   class="w-16 h-16 object-contain" */}
          {/*   src={data.thumbnailURL || "/emblem-music.png"} */}
          {/* /> */}
          <div class={"flex flex-col justify-center"}>
            <span class="overflow-auto">
              {data.type}.{props.tab() === "Audio" ? "mp3" : "mp4"}{" "}
            </span>
            <span>{data.duration}s</span>
          </div>
        </div>
      )}
    </For>
  );
};

const tabs: { value: prisma.MediaType; display: string }[] = [
  { display: "C:\\My Sounds", value: "Audio" },
  { display: "C:\\My Videos", value: "Video" },
];

const MediaWindow = () => {
  const [tab, setTab] = createSignal<prisma.MediaType>("Video");

  return (
    <Window name="Media" imageSrc={Icon}>
      <div class="flex flex-col h-full">
        <div class="border-b border-gray-500 relative">
          <Dropdown value={tab} options={tabs} onChange={setTab} />
        </div>
        <div class="flex-1 overflow-y-auto">
          <div class="min-h-full h-full flex flex-row flex-wrap px-1 content-start">
            <Suspense fallback="Loading...">
              <Contents tab={tab} />
            </Suspense>
          </div>
        </div>
      </div>
    </Window>
  );
};
export default MediaWindow;
