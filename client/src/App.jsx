import { useContext, useEffect, useState } from "react";
import NavBar from "./components/Navbar";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";
import { UserContext } from "./UserContext";
import axios from "axios";
import { useCookies } from "react-cookie";

export default function App({}) {
  const [username, setUsername] = useState("");
  const [cookies, setCookie] = useCookies(["bearer"]);
  const [adminFlag, setAdminFlag] = useState(false);
  const [memberFlag, setMemberFlag] = useState(false);

  console.log(username);
  console.log(adminFlag, memberFlag);
  async function test() {
    let creds;
    try {
      let AuthKey = "Bearer " + cookies.bearer;
      creds = await axios.post(
        "https://only-members-v55m.onrender.com/testauth",
        {},
        {
          headers: {
            Authorization: AuthKey,
          },
          withCredentials: true,
        }
      );
      console.log(creds.data);
      setAdminFlag(creds.data.isAdmin);
      setMemberFlag(creds.data.status);
      setUsername(creds.data.username);
    } catch (err) {
      console.log(err);
    }
  }
  test();

  return (
    <div className="h-[100vh] w-[100vw] flex flex-col overflow-x-hidden">
      <UserContext.Provider
        value={{
          userName: username,
          setUserName: (username) => setUsername(username),
          isAdmin: adminFlag,
          isMember: memberFlag,
          setAdmin: (flag) => setAdminFlag(flag),
          setMember: (flag) => setMemberFlag(flag),
        }}
      >
        <NavBar />
        <Outlet />
        <Footer />
      </UserContext.Provider>
    </div>
  );
}
