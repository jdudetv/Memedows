import { localDB } from "../jsondb";
import { FeedStore, feedStore } from "../stores";

export function EventFeed(event: string, name: string, data: object) {
  feedStore.handleEvent(event, name, data);
  console.log(feedStore.events);
}
