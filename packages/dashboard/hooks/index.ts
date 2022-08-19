import { useLayoutEffect, useRef } from "react";
import { useFirestore, useFirestoreDocData } from "reactfire";
import { PublicStats, UserData } from "@memedows/types";

import { useUser } from "../components/UserProvider";
import { store } from "../data";

interface Args {
  name: string;
}
export const useWindow = ({ name }: Args) => {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    store.windows.windowFocus.push(name);
  }, [name]);

  return { ref, name };
};

export const useIsAuthenticated = () => {
  const user = useUser();

  return [user !== null, user] as const;
};

export const useUserData = () => {
  const [authed, data] = useIsAuthenticated();

  if (!authed) throw new Error("Cannot fetch user data when not signed in");

  const docRef = useFirestore().collection("users").doc(data.uid);

  return useFirestoreDocData(docRef).data as UserData;
};

export const usePublicStats = (): PublicStats => {
  const docRef = useFirestore().collection("public").doc("josh-stats");

  return useFirestoreDocData(docRef).data as PublicStats;
};
