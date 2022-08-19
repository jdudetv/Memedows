import { initializeServices } from "./services";
import "./handlers";
import "./stores";
import { setupObs } from "~/obs/Main";
import { eventsStore } from "./stores";

export async function initialize() {
  await initializeServices();
  await setupObs().catch((e) => console.error(e));
  eventsStore.start();
}
