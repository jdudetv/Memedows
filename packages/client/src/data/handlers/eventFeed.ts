import { localDB } from "../jsondb";
import { FeedStore, feedStore } from "../stores";

export function EventFeed(event: string, name: string, data: any) {
  console.log("EventFeed :" + event);
  if (event === "giftedReceive") {
    let user = feedStore.events.find(
      (thing) => name.toLowerCase() == thing.name.toLowerCase()
    );
    console.log(user);
    if (user?.data.receipients.length != data.total)
      data.receipients.push(data);
  }
  if (event === "giftsubscribe") {
    data.receipients = [];
    let buffer = localDB.getData(`/store/bufferedgifted/`) as object;
    console.log(buffer);
    for (let [index, items] of Object.entries(buffer)) {
      if (
        items.username.toLowerCase() === name.toLowerCase() &&
        data.receipients.length < data.total
      ) {
        data.receipients.push(items);
        localDB.delete(`/store/bufferedgifted/${items.username}`);
      }
    }
  }
  feedStore.handleEvent(event, name, data);
}
