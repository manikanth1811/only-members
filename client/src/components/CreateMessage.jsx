import { IoIosSend } from "react-icons/io";
import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";
import { useNavigate } from "react-router-dom";

export default function Message() {
  const [messageHead, setMessageHead] = useState("");
  const [messageBody, setMessageBody] = useState("");
  const [completeFormError, setCompleteFromError] = useState("");
  const userContext = useContext(UserContext);
  const [errors, setErrors] = useState({
    messageHeadErr: "",
    messageBodyErr: "",
  });
  let redirect = useNavigate();

  let sendMessage = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const msgHead = formData.get("messageHead");
    const msgBody = formData.get("messageBody");

    let newErrors = {
      ...errors,
    };

    if (msgHead.length === 0) {
      newErrors.messageHeadErr = "Message Header should not be empty";
      setErrors(newErrors);
    }

    if (msgBody.length === 0) {
      newErrors.messageBodyErr = "Message Body should not be empty";
      setErrors(newErrors);
    }

    if (msgHead.length != 0) {
      newErrors.messageHeadErr = "";
      setErrors(newErrors);
    }

    if (msgBody.length != 0) {
      newErrors.messageBodyErr = "";
      setErrors(newErrors);
    }

    async function createMessageFn() {
      try {
        const postMessage = await axios.post(
          "https://only-members-v55m.onrender.com/message",
          {
            username: userContext.userName,
            messageBody: msgBody,
            messageHead: msgHead,
          }
        );
        if (postMessage.status === 200) {
          setCompleteFromError("");
          redirect("/");
        }
      } catch (err) {
        setCompleteFromError(
          `Got code ${err.code}, with error message ${err.message}. Please Try again`
        );
      }
    }
    if (errors.messageBodyErr == "" && errors.messageHeadErr == "") {
      createMessageFn();
    }
  };

  return (
    <div className="grow w-[100%] flex justify-center">
      <div className="messageForm flex items-center flex-col w-[80%]">
        <div className="Formheading text-3xl font-bold">Write a message</div>
        <form
          className="flex mt-5 flex-col items-center gap-4"
          onSubmit={() => sendMessage(event)}
        >
          <input
            type="text"
            name="messageHead"
            placeholder="Type Message Heading"
            className="input input-bordered w-full max-w-xs"
            value={messageHead}
            onChange={(event) => setMessageHead(event.target.value)}
          />
          <small className="text-error">
            {errors.messageHeadErr != "" && errors.messageHeadErr}
          </small>
          <textarea
            placeholder="Type Message Body"
            className="textarea textarea-bordered textarea-lg h-[10rem] w-full max-w-xs"
            name="messageBody"
            value={messageBody}
            onChange={(event) => setMessageBody(event.target.value)}
          ></textarea>
          <small className="text-error">
            {errors.messageBodyErr != "" && errors.messageBodyErr}
          </small>
          <button type="submit" className="btn">
            Send Message <IoIosSend size="20" />
          </button>
        </form>
      </div>
    </div>
  );
}
