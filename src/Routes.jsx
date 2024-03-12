import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import SignIn from "./components/SignInPage";
import SignUp from "./components/SignUpPage";
import Message from "./components/CreateMessage";
import Member from "./components/MakeMember";
import Admin from "./components/MakeAdmin";
import SignOut from "./components/SignOut";
import MessageBody from "./components/MessagesBody";

const routes = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <MessageBody />,
      },
      {
        path: "/signin",
        element: <SignIn />,
      },
      {
        path: "/signup",
        element: <SignUp />,
      },
      {
        path: "/message",
        element: <Message />,
      },
      {
        path: "/member",
        element: <Member />,
      },
      {
        path: "/admin",
        element: <Admin />,
      },
      {
        path: "/signout",
        element: <SignOut />,
      },
    ],
  },
]);

export default function Routes() {
  return <RouterProvider router={routes} />;
}
