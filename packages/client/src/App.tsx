import { useEffect, useState } from "react";
import clsx from "clsx";
import { doc, increment, onSnapshot, updateDoc } from "firebase/firestore";
import { ref } from "firebase/storage";
import { db } from "./data/services/firebase";
import { routes } from "~/routes";
import { setupObs } from "./obs/Main";

const App = () => {
  const [route, setRoute] = useState<keyof typeof routes>("EventFeed");

  const RouteComponent = routes[route].component;

  return (
    <div className="w-screen min-h-screen h-auto flex flex-col bg-gray-800">
      <div className="bg-gray-800 w-full h-auto text-white flex flex-row flex-wrap sticky top-0 z-50">
        {Object.entries(routes).map(([key, data]) => (
          <span
            key={key}
            className={clsx(
              "px-4 py-2 cursor-pointer relative",
              key === route && "bg-gray-500"
            )}
            onClick={() => setRoute(key as any)}
          >
            {data.title}
          </span>
        ))}
      </div>
      <div className="flex-1 flex flex-col bg-gray-700">
        <RouteComponent />
      </div>
    </div>
  );
};

export default App;
