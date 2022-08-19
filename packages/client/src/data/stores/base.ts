import { EventEmitter2 } from "eventemitter2";
import { observable, reaction, toJS } from "mobx";

import { getStorePersists } from "~/metadata";
import { localDB } from "../jsondb";

export abstract class BaseStore extends EventEmitter2 {
  initialize() {
    const persists = getStorePersists(this.constructor);

    persists.forEach((p) => {
      let fireImmediately = true;

      try {
        const dbVal = localDB.getData(`/store/${this.constructor.name}/${p}`);
        if (dbVal !== undefined) {
          if (Array.isArray(dbVal)) {
            (this as any)[p].replace(dbVal);
          } else if (typeof dbVal === "object") {
            (this as any)[p] = observable.map(dbVal);
          } else (this as any)[p] = dbVal;

          fireImmediately = false;
        }
      } catch {}

      reaction(
        () => toJS((this as any)[p]),
        () => {
          let newValue = toJS((this as any)[p]);
          if (newValue instanceof Map) newValue = Object.fromEntries(newValue);

          localDB.push(`/store/${this.constructor.name}/${p}`, newValue);
        },
        { fireImmediately }
      );
    });

    return this;
  }
}
