import axios from "axios";
import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

export default function Admin() {
  const [passcode, setPasscode] = useState("");
  const [errors, setErrors] = useState({
    passcodeError: "",
  });
  const [cookies] = useCookies(["bearer"]);
  const redirect = useNavigate();
  const userProviderContext = useContext(UserContext);

  let setAdmin = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const passcode = formData.get("passcode");

    let newErrors = {
      ...errors,
    };

    if (passcode != "manikanth") {
      newErrors.passcodeError = "The entered passcode is wrong";
      setErrors(newErrors);
    } else {
      newErrors.passcodeError = "";
      async function makeAdminFun() {
        try {
          const makeAdmin = await axios.post(
            "https://only-members-v55m.onrender.com/admin",
            {
              username: userProviderContext.userName,
              passcode: "manikanth",
            },
            {
              headers: {
                Authorization: "Bearer " + cookies.bearer,
              },
              withCredentials: true,
            }
          );
          if (makeAdmin.status === 200) {
            userProviderContext.setAdmin(true);
            redirect("/");
          } else {
            newErrors.passcodeError = makeAdmin.status;
          }
          setErrors(newErrors);
        } catch (error) {
          newErrors.passcodeError = "Issue from the server try again";
          setErrors(newErrors);
          redirect("/signin");
        }
      }
      makeAdminFun();
    }
  };

  return (
    <div className="grow w-[100%] flex justify-center">
      <div className="messageForm flex items-center flex-col w-[80%]">
        <div className="Formheading text-3xl font-bold">
          Enter passcode to become a admin
        </div>
        <div className="hint">
          (Hint: first name of creator of this app(check github))
        </div>
        <form
          className="flex mt-5 flex-col items-center gap-4"
          onSubmit={() => setAdmin(event)}
        >
          <input
            type="text"
            name="passcode"
            placeholder="Enter Passcode"
            className="input input-bordered w-full max-w-xs"
            value={passcode}
            onChange={(event) => setPasscode(event.target.value)}
          />
          <small className="text-error">
            {errors.passcodeError != "" && errors.passcodeError}
          </small>
          <button type="submit" className="btn">
            Verify
          </button>
        </form>
      </div>
    </div>
  );
}
