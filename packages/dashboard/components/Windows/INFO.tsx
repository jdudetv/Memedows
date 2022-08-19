import { observer } from "mobx-react-lite";

import Window from "../Window";
import { useIsAuthenticated, useUserData, useWindow } from "../../hooks";
import clsx from "clsx";
import { useFirestore } from "reactfire";
import { useState } from "react";
import { routes } from "./routes";

const INFO = observer(() => {
  const data = useWindow({
    name: "INFO",
  });

  const [route, setRoute] = useState<keyof typeof routes>("FAQ");

  const [isAuthed] = useIsAuthenticated();

  const RouteComponent = routes[route].component;

  return (
    <Window data={data} imageSrc="/emblem-web.png">
      <div className="h-full flex flex-col">
        <div className="bg-gray-800 w-full text-white flex flex-row flex-wrap">
          {Object.entries(routes).map(([key, data]) => (
            <span
              key={key}
              className={clsx(
                "px-2 py-1 font-bold cursor-pointer",
                key === route && "bg-gray-500"
              )}
              onClick={() => setRoute(key as any)}
            >
              {data.title}
            </span>
          ))}
        </div>
        <div className="flex-1 flex-col h-full overflow-y-auto">
          <RouteComponent />
        </div>
      </div>
    </Window>
  );
});

export default INFO;
