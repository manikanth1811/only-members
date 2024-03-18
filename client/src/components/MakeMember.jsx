import axios from "axios";
import { useContext, useState } from "react";
import { UserContext } from "../UserContext";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

export default function Member() {
  const [passcode, setPasscode] = useState("");
  const [errors, setErrors] = useState({
    passcodeError: "",
  });
  const userProvider = useContext(UserContext);
  const navigate = useNavigate();

  const [cookies] = useCookies(["bearer"]);

  let setMember = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const passcode = formData.get("passcode");

    let newErrors = {
      ...errors,
    };

    if (passcode != "sun") {
      newErrors.passcodeError = "The entered passcode is wrong";
      setErrors(newErrors);
    } else {
      newErrors.passcodeError = "";
      setErrors(newErrors);
      async function testMember() {
        try {
          const makeMember = await axios.post(
            "https://only-members-v55m.onrender.com/member",
            {
              username: userProvider.userName,
              passcode: "sun",
            },
            {
              headers: {
                Authorization: "Bearer " + cookies.bearer,
              },
              withCredentials: true,
            }
          );
          console.log(makeMember);
          if (makeMember.status === 200) {
            userProvider.changeStatus(!userProvider.status);
            navigate("/");
          } else {
            navigate("/signin");
          }
        } catch (err) {
          navigate("/signin");
        }
      }
      testMember();
    }
  };

  return (
    <div className="grow w-[100%] flex justify-center">
      <div className="messageForm flex items-center flex-col w-[80%]">
        <div className="Formheading text-3xl font-bold">
          Enter passcode to become a member
        </div>
        <div className="hint">
          (Hint: Nearest star to planet earth(small caps))
        </div>
        <form
          className="flex mt-5 flex-col items-center gap-4"
          onSubmit={() => setMember(event)}
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
