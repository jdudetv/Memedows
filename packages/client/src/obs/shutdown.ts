import { Alignment } from "@sceneify/core";
import { ImageSource } from "@sceneify/sources";
import { asset, wait } from "~/utils";
import { mainScene, MainWrapper } from "./Main";
import { GenericVideo } from "./redemptions";
import { toggleStartMenu } from "./startMenu";
import { keyTap } from "robotjs";
import { MuteMic } from "./MuteMic";

export async function Shutdown() {
  let data = await GenericVideo(
    "Logoff",
    MainWrapper,
    asset`Logoff/LOGOFF.mov`,
    true
  );
  await wait(2000);
  toggleStartMenu();
  await wait(1800);
  toggleStartMenu();
  mainScene.filter("CCorrection")!.setEnabled(true);
  await wait(2800);
}
