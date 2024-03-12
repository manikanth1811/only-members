import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { UserContext } from "../UserContext";

export default function SignOut({}) {
  const [cookies, setCookie] = useCookies(["bearer"]);

  const userContextProvider = useContext(UserContext);
  userContextProvider.setUserName("");
  userContextProvider.setAdmin(false);
  userContextProvider.setMember(false);
  setCookie("bearer", "");
  return (
    <div className="heading grow-1 h-[100%]">
      <div className="titleName font-extrabold text-[2rem] text-center pt-5">
        Sign Out <span className="text-success">Successfull</span>
        <p></p>
        <Link to="/">
          <button className="btn">Home</button>
        </Link>
      </div>
    </div>
  );
}
