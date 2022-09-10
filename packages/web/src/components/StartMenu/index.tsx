import clsx from "clsx";
import { OutsideClickHandler } from "solid-outside-click-handler";
import { Match, Show, Switch } from "solid-js";

import StartMenuImage from "../../assets/StartMenu.png";
import PublicStats from "./PublicStats";
import { toggleStartMenuVisible, uiStore } from "../../stores/ui";
import { user } from "../../utils/auth";
import { supabase } from "../../utils/supabase";
import { resetLayout } from "../../stores";

const StartMenu = () => {
  return (
    <OutsideClickHandler
      onOutsideClick={() =>
        !uiStore.startMenuVisible && toggleStartMenuVisible(false)
      }
    >
      <div
        class={clsx(
          "absolute bottom-0 left-0 z-50 rounded-t-md",
          !uiStore.startMenuVisible && "hidden"
        )}
        style={{
          width: "500px",
          height: "558.89px",
          "background-image": `url(${StartMenuImage})`,
          "background-repeat": "no-repeat",
          "background-size": "contain",
        }}
      >
        <div class="relative w-full h-full flex flex-col">
          <div class="h-20 w-full">
            <div
              class={clsx(
                "absolute rounded-md",
                "w-[64.5px] h-[64.5px] left-[10.5px] top-[9.5px]",
                !user() && "cursor-pointer"
              )}
              style={{
                backgroundImage: "", // user ? `url(${user.photoURL})` : "",
                backgroundSize: "contain",
              }}
              onClick={() =>
                !user() && supabase.auth.signIn({ provider: "twitch" })
              }
            />
            <span
              class={clsx(
                "text-white text-[30px] absolute",
                "left-[90px] top-[18px]",
                "flex flex-col justify-center",
                !user() && "cursor-pointer"
              )}
              onClick={() =>
                !user() && supabase.auth.signIn({ provider: "twitch" })
              }
            >
              <Switch>
                <Match when={user() === undefined}>Loading...</Match>
                <Match when={user() === null}>Click to Login!</Match>
                <Match when={user()}>
                  {(u) => `${u.displayName}: ${u.xp}`}
                </Match>
              </Switch>
            </span>
            <div
              class={clsx(
                "h-9 absolute bottom-2 right-[180px] w-[90px]",
                user() && "cursor-pointer"
              )}
              onClick={() => {
                supabase.auth.signOut();
              }}
            />
            <div
              class="h-10 absolute cursor-pointer bottom-[45%] right-[90px] w-[150px]"
              onClick={resetLayout}
            />
          </div>
          <div class="w-full flex-1 flex flex-row">
            <div class="h-44 flex-1 flex">
              <div class="flex-1 text-lg font-semibold w-full h-44 flex flex-col justify-evenly px-4">
                <Show when={user()} fallback="Login to view your stats!">
                  {(u) => (
                    <>
                      <span>Timeouts: {u.timeouts}</span>
                      <span>Votes: {u.votes}</span>
                      {/* <span>Horny Jail: {user()!.jailVisits}</span> */}
                    </>
                  )}
                </Show>
              </div>
            </div>
            <div class="flex-1 h-full">
              <PublicStats />
            </div>
          </div>
        </div>
      </div>
    </OutsideClickHandler>
  );
};

export default StartMenu;
