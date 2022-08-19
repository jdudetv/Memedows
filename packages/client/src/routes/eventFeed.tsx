import { useEffect, useState } from "react";
import { FeedItem, feedStore } from "~/data/stores/feed";

let BGColour = false;
let NameColor = "text-sky-400";
let ActionColor = "text-sky-400";

const Eventitem = ({ unique, data, name, event }: FeedItem) => {
  switch (event.toLowerCase()) {
    case "bits":
      return (
        <div className="font-bold text-2xl" key={unique}>
          <span className="text-2xl">
            <span className={NameColor}>
              {data.anonymous ? "Anonymouse" : name}
            </span>{" "}
            has cheered{" "}
            <span className={ActionColor}>
              {data.bits} {data.bits == 1 ? "bit" : "bits"}
            </span>
          </span>
          <br></br>
          <span className="text-lg p-0 leading-tight block break-words w-11/12">
            {data.message}
          </span>
        </div>
      );
    case "follow":
      return (
        <div className="font-bold text-2xl" key={unique}>
          <span className="text-2xl">
            <span className={NameColor}>{name}</span> has{" "}
            <span className={ActionColor}>followed!</span>
          </span>
          <br></br>
        </div>
      );
    case "subscription":
    case "resubscription":
    case "donation":
    case "ko-fi subscription":
    case "hypetrainstart":
    case "hypetrainend":
  }

  return (
    <div className="bg-red-600">
      you havent accounted for {event} yet dumbshit!!
    </div>
  );
};

const eventFeedComponent = () => {
  const [, setTick] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setTick((s) => s + 1), 100);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="flex flex-col w-full divide-solid divide-y-2 divide-opacity-100 divide-slate-900">
      {[...feedStore.events].reverse().map((event) => (
        <div
          key={event.unique}
          className="odd:bg-slate-600 even:bg-slate-700 p-2 break-words"
        >
          <Eventitem
            unique={event.unique}
            data={event.data}
            name={event.name}
            event={event.event}
          />
        </div>
      ))}
    </div>
  );
};

export default eventFeedComponent;
