import { useCallback, Suspense } from "react";
import clsx from "clsx";
import firebase from "firebase/app";
import { observer } from "mobx-react-lite";
import OutsideClickHandler from "react-outside-click-handler";

import AuthCheck from "../AuthCheck";
import { store } from "../../data";
import { useIsAuthenticated, useUserData } from "../../hooks";
import { logout } from "../../utils";
import PublicStats from "./PublicStats";
import UserStats from "./UserStats";
import { resetLayout } from "../../data/WindowStore";

let windowObjectReference = null;
let previousUrl = null;

const receiveMessage = async (event) => {
  if (
    event.origin !==
      (process.env.NODE_ENV === "production"
        ? "https://memedo.ws"
        : "http://localhost:3001") ||
    event.source !== windowObjectReference
  ) {
    return;
  }

  const { data: firebaseToken } = event;

  await firebase.auth().signInWithCustomToken(firebaseToken);

  windowObjectReference?.close();
};

const openSignInWindow = async (url: string, name: string) => {
  window.removeEventListener("message", receiveMessage);

  const strWindowFeatures =
    "toolbar=no, menubar=no, width=600, height=700, top=100, left=100";

  if (windowObjectReference === null || windowObjectReference.closed) {
    windowObjectReference = window.open(url, name, strWindowFeatures);
  } else if (previousUrl !== url) {
    windowObjectReference = window.open(url, name, strWindowFeatures);
    windowObjectReference.focus();
  } else {
    windowObjectReference.focus();
  }

  window.addEventListener("message", (event) => receiveMessage(event), false);
  previousUrl = url;
};

const XPText = () => {
  const [authed, user] = useIsAuthenticated();
  const userData: any = useUserData();

  return (
    <span>
      {user.displayName}: {userData.xp}
      xp
    </span>
  );
};

const StartMenu = observer(() => {
  const [loggedIn, user] = useIsAuthenticated();

  const handleLogin = useCallback(() => {
    openSignInWindow(
      process.env.NODE_ENV === "development"
        ? "http://localhost:5001/memedows/australia-southeast1/redirect"
        : "https://australia-southeast1-memedows.cloudfunctions.net/redirect",
      "login"
    );
  }, []);

  return (
    <OutsideClickHandler
      onOutsideClick={() =>
        setTimeout(() => (store.ui.startMenuVisible = false))
      }
      disabled={!store.ui.startMenuVisible}
    >
      <div
        className={clsx(
          "absolute bottom-0 left-0 z-50 rounded-t-md",
          !store.ui.startMenuVisible && "hidden"
        )}
        style={{
          width: 500,
          height: 558.89,
          backgroundImage: "url(/StartMenu.png)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
        }}
      >
        <div className="relative w-full h-full flex flex-col">
          <div className="h-20 w-full">
            <div
              className={clsx(
                "absolute rounded-md",
                !loggedIn && "cursor-pointer"
              )}
              style={{
                width: 64.5,
                height: 64.5,
                left: 10.5,
                top: 9.5,
                backgroundImage: loggedIn ? `url(${user.photoURL})` : "",
                backgroundSize: "contain",
              }}
              onClick={() => !loggedIn && handleLogin()}
            />
            <span
              className={clsx(
                "text-white absolute flex flex-col justify-center",
                !loggedIn && "cursor-pointer"
              )}
              style={{ left: 90, top: 18, fontSize: 30 }}
              onClick={() => !loggedIn && handleLogin()}
            >
              <Suspense fallback="Loading...">
                <AuthCheck fallback="Click to Login">
                  <XPText />
                </AuthCheck>
              </Suspense>
            </span>
            <div
              className={clsx(
                "h-9 absolute bottom-2",
                loggedIn && "cursor-pointer"
              )}
              style={{ right: 180, width: 90 }}
              onClick={logout}
            />
            <div
              className={clsx("h-10 absolute cursor-pointer")}
              style={{ bottom: "45%", right: 90, width: 150 }}
              onClick={resetLayout}
            />
          </div>
          <div className="w-full flex-1 flex flex-row">
            <div className="h-44 flex-1 flex">
              <div className="flex-1 text-lg font-semibold w-full h-44 flex flex-col justify-evenly px-4">
                <Suspense fallback="Loading Stats...">
                  <AuthCheck fallback="Login to view your stats!">
                    <UserStats />
                  </AuthCheck>
                </Suspense>
              </div>
            </div>
            <div className="flex-1 h-full">
              <PublicStats />
            </div>
          </div>
        </div>
      </div>
    </OutsideClickHandler>
  );
});

export default StartMenu;
