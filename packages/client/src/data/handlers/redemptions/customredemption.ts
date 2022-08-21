import { EventFeed } from "../eventFeed";
import { createRedemptionHandler, redemptionEnded } from "./base";

createRedemptionHandler({
  event: "customredemption",
  handler: async (data) => {
    EventFeed("CustomRedemp", data.userName, data);
    redemptionEnded("customredemption");
  },
});
