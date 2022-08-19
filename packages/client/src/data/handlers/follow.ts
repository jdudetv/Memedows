import { FUCKINGFOLLOWCUNT } from "~/obs/Main";
import { GenericSound } from "~/obs/redemptions";
import { asset } from "~/utils";
import { localDB } from "../jsondb";
import { TMIClient } from "../services/emotes";
import { usersStore } from "../stores";
import { createHandler } from "./base";
import { EventFeed } from "./eventFeed";

export const FOLLOW_XP = 100;

export const follow = createHandler({
  event: "follow",
  handler: async (data) => {
    try {
      localDB.getData(`/store/follows/${data.userName}`);
    } catch (error) {
      localDB.push(`/store/follows/${data.userName}`, true);
      EventFeed("Follow", data.userName, data);
      FUCKINGFOLLOWCUNT(data.userName);
      await usersStore.grantXp(data.userId, FOLLOW_XP);
    }
  },
});
