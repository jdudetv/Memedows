import React, { createContext, useContext, useEffect, useState } from "react";
import { useUser as _useUser } from "reactfire";

const UserContext = createContext(null);

export const UserProvider = (props) => {
  const [user, setUser] = useState(null);
  const { data } = _useUser();

  // I had to use JSON.stringify because useUser returns new instance on every call,
  // triggering an infinite update loop. It's bad and should be changed either.
  useEffect(() => setUser(data), [JSON.stringify(data)]);

  return (
    <UserContext.Provider value={user}>{props.children}</UserContext.Provider>
  );
};

export const useUser = () =>
  useContext(UserContext) as firebase.default.User | null;
