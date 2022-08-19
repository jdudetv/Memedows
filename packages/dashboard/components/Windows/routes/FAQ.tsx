import { observer } from "mobx-react-lite";
import { title } from "process";
import { useEffect, useState } from "react";

import { useIsAuthenticated, useUserData, useWindow } from "../../../hooks";

let FAQData = [
  {
    id: 1,
    title: "What is memedows?",
    toggled: false,
    description:
      'Memedows XD is the "operating" system that runs my entire stream. Its built on NodeJS and React. It has been built with the help of Brendonovich and LCLC98',
  },
  {
    id: 2,
    title: "When do you stream?",
    toggled: false,
    description:
      "I currently stream everyday except Tuesdays and Fridays from 1pm AEST",
  },
  {
    id: 3,
    title: "I got timed out for typing 'yo'?",
    toggled: false,
    description:
      "There is a random yo counter that counts everytime yo has been typed in chat. BUT there is a randomly assigned cooldown on the command and if its on cooldown you get timed out.",
  },
  {
    id: 4,
    title: "What is the secret bit?",
    toggled: false,
    description:
      "Every stream a random bit amount is randomly selected from 1-100 bits. If guessed correctly it will discount all redemptions by 5% and give every viewer in chat get 500XP.",
  },
  {
    id: 5,
    title: "What is the wheelofmemefortune?",
    toggled: false,
    description:
      "The wheelofmemefortune is spun through redemptions, a sub, 200+ bits, $2+ donation or gifted subs. There is a number of good and bad options on the wheel. may the odds be ever in your favour.",
  },
  {
    id: 6,
    title: "What is XP?",
    toggled: false,
    description:
      "XP (experience) is earned by watching the stream, subbing, cheering or donating. It is another form of channel points. It can be used to trigger ANY redemption even if it is turned off among other things.",
  },
  {
    id: 7,
    title: "What are refunds?",
    toggled: false,
    description:
      "Refunds are when channel points get returned to the viewer who redeemed it. This can happen 2 ways. The first is a level 5 100% hype train will refund all redemptions currently in the queue. The 2nd is by hitting the stream goals in the start menu. Whereupon all redemptions will refund for 69 seconds after the goal is hit. (you can type !start to see the goals and the currently free redemption for subs.)",
  },
  {
    id: 8,
    title: "What is first chatters?",
    toggled: false,
    description:
      "The first 10 people to type in chat each stream will receive an XP bonus for the duration of that stream. (1st 2x, 2nd, 1.9x etc)",
  },
  {
    id: 9,
    title: "What are tier x refunds?",
    toggled: false,
    description:
      "Subs and different subscription tiers (4+ is on Patreon) will refund automatically for people who redeem it and who are currently subbed to that tier. You can see which ones refund in their description.",
  },
  {
    id: 10,
    title: "What is horny jail?",
    toggled: false,
    description:
      "Horny jail is where you get sent if you`re horny.(69 second timeout)",
  },
  {
    id: 11,
    title: "Why are some of the redemptions missing?",
    toggled: false,
    description:
      "Redemptions now turn on and off dynamically based on events in the stream. There is XP groups that can be toggled by spending experience. Also the first 5 stream goals met will unlock a new redemption for that stream. Alternatively during a hype train a new redemption unlocks for each level.",
  },
  {
    id: 12,
    title: "Why do redemption prices change?",
    toggled: false,
    description:
      "We have built in spame prevention on redemptions so the more they are redeemed in a short time the higher the price goes. Also they are discounted during a hype train.",
  },
  {
    id: 13,
    title: "What is commandsChat?",
    toggled: false,
    description:
      "CommandsChat window on the site is for entering the XP commands and for playing minesweeper.",
  },
  {
    id: 14,
    title: "How do I play minesweeper?",
    toggled: false,
    description:
      "You play minesweeper by typing !dig or !flag and a coordinate (!dig f5) for example. When the board is present on the stream.",
  },
  {
    id: 15,
    title: "How do I submit a custom redemption?",
    toggled: false,
    description:
      "Custom redemptions can be submitted by DMing me a .mp4 (max 15s) or .mp3 (max 30s) on discord. type !discord in chat to join",
  },
  {
    id: 16,
    title: "How do I report a bug?",
    toggled: false,
    description:
      "We have a #bugs channel in discord. Please report all bugs there. !discord in chat to get the link to discord.",
  },
  {
    id: 17,
    title: "What is H. Court?",
    toggled: false,
    description:
      "H. Court stands for horny court (twitch wouldnt let me call it that) You enter in another users username. And it begins a chat poll to decide whether they get timed out or not. If the poll ties, you both get timed out. If its voted no, you get timed out.",
  },
  {
    id: 18,
    title: "What is chaos?",
    toggled: false,
    description:
      "The chaos redemption will start spamming 50 random videos from the videos redemption list. it MAY crash stream.",
  },
  {
    id: 19,
    title: "What redemptions turn on during a hype train?",
    toggled: false,
    description: "LEVEL 1: Explosion, Level 5: Thanos Snap.",
  },
  {
    id: 20,
    title: "What redemptions are enabled by stream goals?",
    toggled: false,
    description: "1: , 2: Horny Court, 3: Explosion, 4: Chaos, 5: NUKE.",
  },
];

const ListItem = ({ data }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="py-2 w-full">
      <div
        className="mx-2 text-2xl font-bold hover:text-gray-600 cursor-pointer"
        onClick={() => setOpen(!open)}
      >
        <div>{data.title}</div>
        {open && <div className="mx-2 text-lg">{data.description}</div>}
      </div>
    </div>
  );
};

const FrequentlyAskedQuestions = () => {
  return (
    <div className="flex-1 min-h-full h-full flex-row flex-wrap content-start divide-y-2 divide-black">
      {FAQData.map((item) => (
        <ListItem key={item.id} data={item} />
      ))}
    </div>
  );
};

export default FrequentlyAskedQuestions;
