import { EventPayloadMap } from "@memedows/types";
import { onSnapshot, collection, deleteDoc, doc } from "firebase/firestore";
import { observable, action } from "mobx";

import { db } from "../services/firebase";
import { BaseStore } from "./base";

interface EventSubEventDoc {
  payload: any;
  timestamp: any;
  type: string;
  id: string;
}

export class EventsStore extends BaseStore {
  @observable listening = false;
  @observable latestEvent: any;

  constructor() {
    super();
  }

  @action
  async handleEvent({ id, payload, type }: EventSubEventDoc) {
    this.latestEvent = { id, payload };
    console.log(type, payload);

    this.emitAsync(type, payload);

    deleteDoc(doc(db, "events", id));
  }

  on<E extends keyof EventPayloadMap>(
    event: E,
    callback: (data: EventPayloadMap[E]) => void
  ) {
    return super.on(event, callback);
  }

  async start() {
    onSnapshot(collection(db, "events"), (snapshot) => {
      this.listening = true;
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added")
          this.handleEvent({
            id: change.doc.id,
            ...(change.doc.data() as any),
          });
      });
    });
  }
}

export async function FakeEvent(
  title: string,
  name?: string,
  message?: string,
  user_id?: string
) {
  eventsStore.emit("redemptionAdd", {
    fake: true,
    userName: name,
    input: message,
    reward: { title: title },
    userId: user_id,
  });
}

export const eventsStore = new EventsStore();
