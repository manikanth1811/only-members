import { createContext } from "react";

export const UserContext = createContext({
  userName: "",
  setUserName: () => {},
  setAdmin: () => {},
  setMember: () => {},
  isAdmin: false,
  isMember: false,
});
