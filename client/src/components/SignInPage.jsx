import { useState } from "react";
import { useContext } from "react";
import { UserContext } from "../UserContext";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [cookies, setCookie] = useCookies(["bearer"]);
  const [completeFormErrors, setCompleteFormErrors] = useState("");
  const [errors, setErrors] = useState({
    usernameErr: "",
    passwordErr: "",
  });
  const userContextProvider = useContext(UserContext);
  const redirect = useNavigate();
  console.log(userContextProvider.userName);
  let sendSignIn = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const usernameForm = formData.get("username");
    const passwordForm = formData.get("password");

    let newErrors = {
      ...errors,
    };

    if (usernameForm.length === 0) {
      newErrors.usernameErr = "Username should not be empty";
      setErrors(newErrors);
    }

    if (passwordForm.length === 0) {
      newErrors.passwordErr = "Password should not be empty";
      setErrors(newErrors);
    }

    if (usernameForm.length != 0) {
      newErrors.usernameErr = "";
      setErrors(newErrors);
    }

    if (passwordForm.length != 0) {
      newErrors.passwordErr = "";
      setErrors(newErrors);
    }
    if (errors.passwordErr === "" && errors.usernameErr === "") {
      async function test() {
        try {
          const creds = await axios.post(
            "https://only-members-v55m.onrender.com/sign-in",
            {
              username: usernameForm,
              password: passwordForm,
            }
          );
          console.log(creds.data);
          if (creds.status === 200) {
            // set the cookies and the username
            setCookie("bearer", creds.data.token);
            userContextProvider.setUserName(usernameForm);
            redirect("/");
            setCompleteFormErrors("");
          }
        } catch (error) {
          setCompleteFormErrors(
            `Got code ${err.code}, with error message ${err.message}. Please Try again`
          );
          console.log(error);
        }
      }
      test();
    }
    console.log(usernameForm, passwordForm);
  };

  return (
    <div className="grow w-[100%] flex justify-center">
      <div className="messageForm flex items-center flex-col w-[80%]">
        <div className="Formheading text-3xl font-bold">Sign In</div>
        <form
          className="flex mt-5 flex-col items-center gap-4"
          onSubmit={() => sendSignIn(event)}
        >
          <input
            type="text"
            name="username"
            placeholder="username"
            className="input input-bordered w-full max-w-xs"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
          <small className="text-error">
            {errors.usernameErr != "" && errors.usernameErr}
          </small>
          <input
            placeholder="password"
            className="input input-bordered w-full max-w-xs"
            type="password"
            name="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          <small className="text-error">
            {errors.passwordErr != "" && errors.passwordErr}
          </small>
          <button type="submit" className="btn">
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
