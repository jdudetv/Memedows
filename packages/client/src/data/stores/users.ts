import type { NewUserData, UserData, UserSubStatus } from "@memedows/types";
import { observable } from "mobx";
import {
  collection,
  deleteDoc,
  doc,
  increment,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

import { persist } from "../../decorators";
import { BaseStore } from "./base";
import { db } from "../services/firebase";
import { FOLLOW_XP, SUBSCRIBE_XP } from "../handlers";
import { mainScene, obs } from "~/obs/Main";
import { localDB } from "../jsondb";
import { Scene } from "@sceneify/core";
import { GDIPlusTextSource, ImageSource } from "@sceneify/sources";
import { ColorCorrectionFilter } from "@sceneify/filters";
import { asset, wait } from "~/utils";
import { animate } from "@sceneify/animation";
import { GenericSound } from "~/obs/redemptions";
import { TMIClient } from "../services/emotes";

class UsersStore extends BaseStore {
  @observable
  @persist
  accounts = new Map<string, UserData>();

  @observable
  @persist
  lastUserFetch = 0;

  initialize() {
    super.initialize.call(this);

    onSnapshot(
      query(
        collection(db, "new_users"),
        where("createdAt", ">=", new Date(this.lastUserFetch))
      ),
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === "added")
            this.handleNewUser(change.doc.data() as NewUserData);
        });
      }
    );

    return this;
  }

  async handleNewUser(data: NewUserData) {
    console.log(data);
    await deleteDoc(doc(db, "new_users", data.id));
    console.log("doc delete");
    TMIClient.say(
      "jdudetv",
      `${data.displayName} Just signed up on the website`
    );
    let xp = 0;

    if (data.subscription !== 0) xp += (SUBSCRIBE_XP as any)[data.subscription];

    if (data.following) xp += FOLLOW_XP;

    const userData: UserData = {
      ...data,
      timeouts: 0,
      jailVisits: 0,
      votes: 0,
      xp,
    };

    this.accounts.set(data.displayName.toLowerCase(), userData);
    await setDoc(doc(db, "users", data.id), userData);
    this.lastUserFetch = Date.now();
  }

  async addTimeout(id: string) {
    let userData;
    this.accounts.forEach((data) => {
      if (data.id === id) {
        userData = data;
      }
    });
    if (!userData) return;

    userData.timeouts++;

    await updateDoc(doc(db, "users", id), {
      timeouts: increment(1),
    });
  }

  async addVote(id: string) {
    let userData;
    this.accounts.forEach((data) => {
      if (data.id === id) {
        userData = data;
      }
    });
    if (!userData) return;

    userData.votes++;

    await updateDoc(doc(db, "users", id), {
      votes: increment(1),
    });
  }

  async addHorny(id: string) {
    let userData;
    this.accounts.forEach((data) => {
      if (data.id === id) {
        userData = data;
      }
    });
    if (!userData) return;

    userData.jailVisits++;

    await updateDoc(doc(db, "users", id), {
      jailVisits: increment(1),
    });
  }

  async grantXp(id: string, amount: number) {
    try {
      await updateDoc(doc(db, "users", id), {
        xp: increment(amount),
      });
    } catch (err) {
      console.log(err);
      return;
    }

    let userData = this.accounts.get(id);
    if (!userData) return;
    userData.jailVisits;

    if (!userData.xp) userData.xp = 0;
    userData.xp += amount;
  }
}

export const usersStore = new UsersStore().initialize();
