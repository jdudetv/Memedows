import { Suspense, useState } from "react";
import { observer } from "mobx-react-lite";
import { useFirestore, useFirestoreDocData } from "reactfire";
import clsx from "clsx";

import Window from "../../Window";
import { useWindow } from "../../../hooks";
import Dropdown from "./Dropdown";

interface ContentsProps {
  type: string;
}
const Contents = ({ type }: ContentsProps) => {
  const docRef = useFirestore().collection("public").doc(type.toLowerCase());
  const data: any = useFirestoreDocData(docRef).data;

  return (
    <>
      {Object.entries(data)
        .filter(([name]) => name !== "NO_ID_FIELD")
        .sort()
        .map(([name, data]: any) => (
          <div
            className="text-left mt-2 mx-1 flex flex-row items-center text-black w-48 text-sm break-words space-x-2 last:mb-2"
            key={name}
          >
            <img
              className="w-16 h-16 object-contain"
              src={data.thumbnailURL || "/emblem-music.png"}
            />
            <div className={"flex flex-col justify-center"}>
              <span className="overflow-auto">
                {name}.{type === "Sounds" ? "mp3" : "mp4"}{" "}
              </span>
              <span>{data.duration}s</span>
            </div>
          </div>
        ))}
    </>
  );
};

const tabs = [
  { display: "C:\\My Sounds", value: "sounds" },
  { display: "C:\\My Videos", value: "videos" },
];

const MediaWindow = observer(() => {
  const data = useWindow({
    name: "Explorer",
  });

  const [tab, setTab] = useState(tabs[0]);

  return (
    <Window data={data} imageSrc="/folder-visiting.png">
      <div className="flex flex-col h-full">
        <div className="border-b border-gray-500 relative">
          <Dropdown value={tab} options={tabs} onChange={setTab} />
        </div>
        <div className="flex-1 overflow-y-auto">
          <div className="min-h-full h-full flex flex-row flex-wrap px-1 content-start">
            <Suspense fallback={<></>}>
              <Contents type={tab.value} />
            </Suspense>
          </div>
        </div>
      </div>
    </Window>
  );
});
export default MediaWindow;
