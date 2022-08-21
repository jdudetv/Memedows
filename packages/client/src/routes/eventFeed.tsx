import { useEffect, useState } from "react";
import { redemptionEnded } from "~/data/handlers/redemptions/base";
import { FeedItem, feedStore } from "~/data/stores/feed";

let BGColour = false;
let NameColor = "text-sky-300";
let ActionColor = "text-sky-300";

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
          <span className="text-lg p-0 leading-tight block break-words w-11/12 text-sky-600">
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
      return (
        <div className="font-bold text-2xl" key={unique}>
          <span className="text-2xl">
            <span className={NameColor}>{name}</span>
            <span className={ActionColor}>{" Just Subscribed!"}</span>
          </span>
        </div>
      );
    case "giftsubscribe":
      return (
        <div className="font-bold text-2xl" key={unique}>
          <span className="text-2xl">
            <span className={NameColor}>{name + " "}</span>
            has gifted
            <span className={ActionColor}>
              {" " + data.total} {data.total > 1 ? " subs " : " sub "}
            </span>
            to:
          </span>
          <br></br>
          <span className="text-lg p-0 leading-tight block break-words w-11/12">
            {[...data.receipients].map((item) => (
              <div key={item} className="text-2xl pl-4 text-sky-200">
                {"● " + item.recipient}
                <br></br>
              </div>
            ))}
          </span>
        </div>
      );
    case "resubscription":
      return (
        <div className="font-bold text-2xl" key={unique}>
          <span className="text-2xl">
            <span className={NameColor}>{name + " "}</span>
            has
            <span className={ActionColor}>{" Resubscribed "}</span>
            for
            <span className={ActionColor}>
              {" " + data.cumulative + " Months"}
            </span>
          </span>
        </div>
      );
    case "raid":
      return (
        <div className="font-bold text-2xl" key={unique}>
          <span className="text-2xl">
            <span className={NameColor}>{name + " "}</span>
            has
            <span className={ActionColor}>{" Raided! "}</span>
            with
            <span className={ActionColor}>
              {" " + data.viewers + " Viewers"}
            </span>
          </span>
        </div>
      );
    case "customredemp":
      return (
        <div className="font-bold text-2xl" key={unique}>
          <span className="text-2xl">
            <span className={NameColor}>{name}</span>
            <span className={ActionColor}>
              {" has redeemed custom redemption "}
              <button
                className="rounded-full bg-sky-700 text-xl px-2"
                onClick={() => {
                  feedStore.removeItem(unique);
                }}
              >
                {" "}
                Clear Item{" "}
              </button>
            </span>
          </span>
        </div>
      );
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
      {[...feedStore.events].map((event) => (
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
