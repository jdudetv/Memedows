import { localDB } from "../jsondb";
import { feedStore } from "../stores";
import { TMIClient } from "./emotes";

TMIClient.on(
  "subgift",
  async (channel, username, streakMonths, recipient, methods, userstate) => {
    localDB.push(
      `/store/chatcolors/${username.toLowerCase()}`,
      userstate.color
    );
    console.log("SubGift");
    let FeedItem = feedStore.events.find((item) => item.name === username);
    if (!FeedItem) {
      localDB.push(`/store/bufferedgifted/${username}`, {
        username: username,
        recipient: recipient,
      });
      return;
    }
    if (FeedItem.data.receipients.length === FeedItem.data.total) {
      localDB.push(`/store/bufferedgifted/${username}`, {
        username: username,
        recipient: recipient,
      });
      return;
    }
    let array = FeedItem.data.receipients;
    array.push({ username: username, recipient: recipient });
    FeedItem.data.receipients = array;
  }
);
