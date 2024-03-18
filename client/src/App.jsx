import { useContext, useEffect, useState } from "react";
import NavBar from "./components/Navbar";
import Footer from "./components/Footer";
import { Outlet } from "react-router-dom";
import { UserContext } from "./UserContext";
import axios from "axios";
import { useCookies } from "react-cookie";

export default function App({}) {
  const [cookies, setCookie] = useCookies(["bearer"]);
  const [username, setUsername] = useState("");
  const [status, setStatus] = useState(true);
  const [adminFlag, setAdminFlag] = useState(false);
  const [memberFlag, setMemberFlag] = useState(false);

  useEffect(() => {
    let s = true;
    if (s) test();
    return () => {
      s = false;
    };
  }, [username, status]);

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
      setAdminFlag(creds.data.isAdmin);
      setMemberFlag(creds.data.status);
      setUsername(creds.data.username);
    } catch (err) {
      console.log(err);
      setAdminFlag(false);
      setMemberFlag(false);
    }
  }

  console.log(adminFlag, memberFlag);
  console.log(username);
  return (
    <div className="h-[100vh] w-[100vw] flex flex-col overflow-x-hidden">
      <UserContext.Provider
        value={{
          userName: username,
          setUserName: (username) => {
            setUsername(username);
          },
          isAdmin: adminFlag,
          changeStatus: (statusFlag) => {
            setStatus(statusFlag);
          },
          status: status,
          isMember: memberFlag,
        }}
      >
        <NavBar />
        <Outlet />
        <Footer />
      </UserContext.Provider>
    </div>
  );
}
