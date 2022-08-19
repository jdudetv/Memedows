import Donos from "./donos";
import FrequentlyAskedQuestions from "./FAQ";
import Sbit from "./sbit";
import XPCOMMANDS from "./XPCOMMANDS";

export const routes = {
  FAQ: {
    component: FrequentlyAskedQuestions,
    title: "FAQ",
  },
  XPCommands: {
    component: XPCOMMANDS,
    title: "XP Commands",
  },
  SecretBit: {
    component: Sbit,
    title: "Secret Bit",
  },
  Donations: {
    component: Donos,
    title: "Donos",
  },
};
