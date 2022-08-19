import { eventSubStore } from "~/data/stores/eventSub";
import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import Toggle from "~/components/ui/Toggle";

const EventSubSubscriptions = observer(() => {
  useEffect(() => {
    eventSubStore.loadSubscriptions();
  }, []);

  const subscriptions = eventSubStore.subscriptions;

  return (
    <div className="flex flex-row flex-wrap justify-between px-2">
      {[...subscriptions!.entries()].map(([name, id]) => {
        var result = name.replace(/([A-Z])/g, " $1");

        return (
          <div
            key={name}
            className="rounded-md text-center whitespace-nowrap flex-1 mx-2 mt-4 bg-gray-900 flex flex-col items-center space-y-4 text-xl font-semibold px-8 py-4 text-white"
          >
            <span>{result.charAt(0).toUpperCase() + result.slice(1)}</span>
            <Toggle
              enabled={id !== null}
              onChange={() => eventSubStore.toggleStatus(name as any)}
            />
          </div>
        );
      })}
    </div>
  );
});

export default EventSubSubscriptions;
