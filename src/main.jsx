import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Routes from "./Routes.jsx";
import { CookiesProvider } from "react-cookie";
import TimeAgo from "javascript-time-ago";

import en from "javascript-time-ago/locale/en";
import ru from "javascript-time-ago/locale/ru";

TimeAgo.addDefaultLocale(en);
TimeAgo.addLocale(ru);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <CookiesProvider defaultSetOptions={{ path: "/" }}>
      <Routes />
    </CookiesProvider>
  </React.StrictMode>
);
