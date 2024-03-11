import axios from "axios";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [fullname, setFullname] = useState("");
  const [errors, setErrors] = useState({
    usernameErr: "",
    passwordErr: "",
    fullNameErr: "",
  });
  const redirect = useNavigate();
  const [completeFormError, setCompleteFormError] = useState("");

  let sendSignIn = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const usernameForm = formData.get("username");
    const passwordForm = formData.get("password");
    const fullNameForm = formData.get("fullname");
    const usernameRe = /^[\w\s]*$/;
    const fullnameRe = /^[a-zA-Z\s]*$/;

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

    if (fullNameForm.length === 0) {
      newErrors.fullNameErr = "Fullname should not be empty";
      setErrors(newErrors);
    }

    if (!usernameRe.test(usernameForm)) {
      newErrors.usernameErr =
        "The username should be Alphanumeric(only numbers and alphabets).";
      setErrors(newErrors);
    }

    if (!fullnameRe.test(fullNameForm)) {
      newErrors.fullNameErr = "The Fullname should only have alphabets.";
      setErrors(newErrors);
    }

    if (usernameForm.length != 0 || usernameRe.test(usernameForm)) {
      newErrors.usernameErr = "";
      setErrors(newErrors);
    }

    if (passwordForm.length != 0) {
      newErrors.passwordErr = "";
      setErrors(newErrors);
    }

    if (fullNameForm.length != 0 || fullnameRe.test(fullNameForm)) {
      newErrors.fullNameErr = "";
      setErrors(newErrors);
    }
    async function signUpCall() {
      try {
        const signUpRes = await axios.post("http://localhost:3000/sign-up", {
          username: usernameForm,
          password: passwordForm,
          fullname: fullNameForm,
        });
        console.log(signUpRes);
        if (signUpRes.status === 200) {
          setCompleteFormError("");
          redirect("/signin");
        }
      } catch (err) {
        setCompleteFormError(
          `Got code ${err.code}, with error message ${err.message}. Please Try again`
        );
      }
    }

    if (
      newErrors.fullNameErr === "" &&
      newErrors.passwordErr === "" &&
      newErrors.fullNameErr === ""
    ) {
      signUpCall();
    }
  };

  return (
    <div className="grow w-[100%] flex justify-center">
      <div className="messageForm flex items-center flex-col w-[80%]">
        <div className="Formheading text-3xl font-bold">Sign Up</div>
        <form
          className="flex mt-5 flex-col items-center gap-4"
          onSubmit={() => sendSignIn(event)}
        >
          <input
            type="text"
            name="fullname"
            placeholder="Enter Fullname"
            className="input input-bordered w-full max-w-xs"
            value={fullname}
            onChange={(event) => setFullname(event.target.value)}
          />
          <small className="text-error">
            {errors.fullNameErr != "" && errors.fullNameErr}
          </small>
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
            Sign Up
          </button>
          {completeFormError != "" && (
            <small className="text-error">{completeFormError}</small>
          )}
        </form>
      </div>
    </div>
  );
}
