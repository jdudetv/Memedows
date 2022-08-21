import { EventPayloadMap } from "@memedows/types";
import { onSnapshot, collection, deleteDoc, doc } from "firebase/firestore";
import { observable, action, reaction, toJS } from "mobx";
import { v4 } from "uuid";
import { persist } from "~/decorators";
import { getStorePersists } from "~/metadata";
import { localDB } from "../jsondb";

import { db } from "../services/firebase";
import { BaseStore } from "./base";

export interface FeedItem {
  event: string;
  name: string;
  data: any;
  unique: string;
}

export class FeedStore extends BaseStore {
  @observable listening = false;
  @observable @persist events = new Array<FeedItem>();

  constructor() {
    super();
  }

  @action
  async handleEvent(event: string, name: string, data: object) {
    let unique = v4();
    let payload = { event, name, data, unique };
    this.events.unshift(payload as FeedItem);
    while (this.events.length > 100) {
      this.events.pop();
    }
  }

  removeItem(unique: string) {
    let deleteItem = this.events.find((thing) => unique == thing.unique);
    let position = this.events.indexOf(deleteItem!);
    this.events.splice(position, 1);
  }

  initialize() {
    const persists = getStorePersists(this.constructor);

    persists.forEach((p) => {
      let fireImmediately = true;

      try {
        const dbVal = localDB.getData(`/store/${this.constructor.name}/${p}`);
        if (dbVal !== undefined) {
          (this as any)[p] = observable.array(dbVal);
          fireImmediately = false;
        }
      } catch {}

      reaction(
        () => toJS((this as any)[p]),
        () => {
          let newValue = toJS((this as any)[p]);

          localDB.push(`/store/${this.constructor.name}/${p}`, newValue);
        },
        { fireImmediately }
      );
    });

    return this;
  }

  on<E extends keyof EventPayloadMap>(
    event: E,
    callback: (data: EventPayloadMap[E]) => void
  ) {
    return super.on(event, callback);
  }
}

export const feedStore = new FeedStore().initialize();
