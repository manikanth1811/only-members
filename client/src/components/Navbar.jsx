import { Link } from "react-router-dom";
import {
  FaSignInAlt,
  FaUser,
  FaUserTie,
  FaUserCheck,
  FaEdit,
} from "react-icons/fa";
import { MdLogout } from "react-icons/md";
import { useContext } from "react";
import { UserContext } from "../UserContext";

function MenuItems({ userData }) {
  if (userData.username === "" || userData.username === undefined) {
    return (
      <>
        <li>
          <Link to="/signin">
            <a className="text-lg font-bold flex items-center gap-1">
              <span className="text-secondary">Sign </span>
              <span> In </span>
              <span className="h-[100%] flex items-center">
                <FaSignInAlt size="20" />
              </span>
            </a>
          </Link>
        </li>
        <li>
          <Link to="/signup">
            <a className="text-lg font-bold flex items-center gap-1">
              <span className="text-primary">Sign </span>
              <span>Up</span>
              <span className="h-[100%] flex items-center">
                <FaUser size="17" />
              </span>
            </a>
          </Link>
        </li>
      </>
    );
  } else if (!userData.isStatus) {
    return (
      <>
        <li>
          <Link to="/message">
            <a className="text-lg font-bold flex items-center gap-1">
              <span>Write a </span>
              <span className="text-primary"> Message </span>
              <span className="h-[100%] flex items-center">
                <FaEdit size="20" />
              </span>
            </a>
          </Link>
        </li>
        <li>
          <Link to="/member">
            <a className="text-lg font-bold flex items-center gap-1">
              <span>Become a </span>
              <span className="text-primary"> Member</span>
              <span className="h-[100%] flex items-center">
                <FaUserCheck size="18" />
              </span>
            </a>
          </Link>
        </li>
        <li>
          <a className="text-lg font-bold flex items-center gap-1">
            <span className="text-primary">Sign </span>
            <span>Out</span>
            <span className="h-[100%] flex items-center ">
              <MdLogout size="17" />
            </span>
          </a>
        </li>
      </>
    );
  } else if (!userData.isAdmin && userData.isStatus) {
    return (
      <>
        <li>
          <Link to="/message">
            <a className="text-lg font-bold flex items-center gap-1">
              <span>Write a </span>
              <span className="text-primary"> Message </span>
              <span className="h-[100%] flex items-center">
                <FaEdit size="20" />
              </span>
            </a>
          </Link>
        </li>
        <li>
          <Link to="/admin">
            <a className="text-lg font-bold flex items-center gap-1">
              <span>Become a </span>
              <span className="text-primary">Admin</span>
              <span className="h-[100%] flex items-center">
                <FaUserTie size="15" />
              </span>
            </a>
          </Link>
        </li>
        <li>
          <a className="text-lg font-bold flex items-center gap-1">
            <span className="text-primary">Sign </span>
            <span>Out</span>
            <span className="h-[100%] flex items-center ">
              <MdLogout size="17" />
            </span>
          </a>
        </li>
      </>
    );
  } else {
    return (
      <>
        <li>
          <Link to="/message">
            <a className="text-lg font-bold flex items-center gap-1">
              <span>Write a </span>
              <span className="text-primary"> Message </span>
              <span className="h-[100%] flex items-center">
                <FaEdit size="20" />
              </span>
            </a>
          </Link>
        </li>
        <li>
          <a className="text-lg font-bold flex items-center gap-1">
            <span>You are a </span>
            <span className="text-primary">Admin</span>
            <span className="h-[100%] flex items-center">
              <FaUserTie size="15" />
            </span>
          </a>
        </li>
        <li>
          <a className="text-lg font-bold flex items-center gap-1">
            <span className="text-primary">Sign </span>
            <span>Out</span>
            <span className="h-[100%] flex items-center ">
              <MdLogout size="17" />
            </span>
          </a>
        </li>
      </>
    );
  }
}

export default function NavBar() {
  const userContextProvider = useContext(UserContext);

  const userData = {
    username: userContextProvider.userName ? userContextProvider.userName : "",
    isStatus: userContextProvider.isMember,
    isAdmin: userContextProvider.isAdmin,
  };

  return (
    <div className="navigationMenu w-[100%] h-[10%] grow-0">
      <div className="navbar bg-base-100 justify-between">
        <div className="navbar-start lg:grow-0 grow-2 flex w-[100%] lg:w-[fit-content]">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
            >
              <MenuItems userData={userData} />
            </ul>
          </div>
          <div className="flex w-[100%] justify-center mr-5 lg:justify-normal mx-auto">
            <Link to="/">
              <a className="btn btn-ghost text-3xl font-extrabol pt-2 text-primary">
                Members <span className="text-accent">Only</span>
              </a>
            </Link>
          </div>
        </div>

        <div className="navbar-end hidden lg:flex lg:grow-2 grow-0 w-fit">
          {userData && (
            <ul className="menu menu-horizontal px-4 flex gap-6">
              <MenuItems userData={userData} />
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
