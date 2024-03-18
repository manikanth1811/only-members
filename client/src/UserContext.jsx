import { createContext } from "react";

export const UserContext = createContext({
  userName: "",
  setUserName: () => {},
  changeStatus: () => {},
  status: true,
});
