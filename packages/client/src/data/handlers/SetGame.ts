import { eventsStore, redemptionsStore } from "../stores";

let GamesGroups = [
  { group: "Marbles", catagory: "marbles on stream" },
  { group: "Minecraft", catagory: "minecraft" },
];

eventsStore.on("channelUpdate", async (p) => {
  // console.log(GamesGroups[p.category.toLowerCase()])
  for (let [index, names] of GamesGroups.entries()) {
    if (p.category.toLowerCase() === names.catagory) {
      redemptionsStore.setGroup(names.group, true);
      console.log("turning on group ", names);
    } else {
      redemptionsStore.setGroup(names.group, false);
      console.log("turning off group ", names);
    }
  }
});
