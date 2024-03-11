import { useContext, useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { MdAccessTimeFilled } from "react-icons/md";
import { UserContext } from "../UserContext";
import axios from "axios";
import { useCookies } from "react-cookie";
import TimeAgo from "react-timeago";

function timeHelper(date) {
  return date.getTime();
}

async function deleteMsg(id, username, messageList, changeMessageList) {
  try {
    const deleteM = await axios.post("http://localhost:3000/deletemessage", {
      username: username,
      id: id,
    });
    let newMessages = [];
    if (deleteM.status === 200) {
      messageList.forEach((message) => {
        if (message._id != id) {
          newMessages.push(message);
        }
      });
      changeMessageList(newMessages);
    }
  } catch (err) {}
}

function SingleMessage({
  user,
  message,
  deleteMessage,
  messageList,
  changeMessageList,
}) {
  return (
    <div className="card w-96 md:w-[35rem] bg-base-100 shadow-xl">
      <div className="card-body">
        <h1 className="card-title">{message.messageHead}</h1>
        <p className="line-clamp-2">{message.messageBody}</p>
        <div className="flex justify-between flex-col md:flex-row gap-2 w-[100%] pt-3">
          {!user.status && (
            <div className="flex w-[100%] justify-center">
              <div className="skeleton w-[80%] h-6"></div>
            </div>
          )}
          {user.status && (
            <>
              <div className="username flex w-[50%]">
                {!user.status ? (
                  <div className="skeleton w-[100%] h-4"></div>
                ) : (
                  <div className="username font-bold flex items-center gap-1">
                    <FaUser />
                    <span className="text-primary w-[100%] line-clamp-1">
                      {message.messageUser ? message.messageUser.username : ""}
                    </span>
                  </div>
                )}
              </div>
              <div className="postedDate flex w-[40%]">
                {!user.status ? (
                  <></>
                ) : (
                  <div className="dateposted flex items-center font-bold">
                    <div className="flex gap-1 items-center">
                      <MdAccessTimeFilled />
                      <span>
                        <TimeAgo
                          date={timeHelper(new Date(message.messageTime))}
                        />
                      </span>
                    </div>
                  </div>
                )}
              </div>
              {user.isAdmin ? (
                <button
                  className="deleteBtn btn-primary btn  w-[50%] lg:w-[fit-content]"
                  onClick={() =>
                    deleteMsg(
                      message._id,
                      user.username,
                      messageList,
                      changeMessageList
                    )
                  }
                >
                  Remove
                </button>
              ) : (
                <button
                  disabled="disabled"
                  className="deleteBtn btn-primary btn"
                >
                  Remove
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MessageBody() {
  const userContextProvider = useContext(UserContext);
  const [messageData, setMessageData] = useState([]);
  const [deleteMessage, setDeleteMessage] = useState(false);
  const [cookies] = useCookies(["bearer"]);
  let messageError = "";
  let messages;
  const user = {
    status: userContextProvider.isMember,
    username: userContextProvider.userName,
    isAdmin: userContextProvider.isAdmin,
  };
  console.log(
    `user data ${userContextProvider.isMember} , ${userContextProvider.isAdmin}, ${userContextProvider.userName}`
  );

  async function getMessages() {
    try {
      messages = await axios.post(
        "http://localhost:3000/",
        {
          username: userContextProvider.userName,
        },
        {
          headers: {
            Authorization: "Bearer " + cookies.bearer,
          },
          withCredentials: true,
        }
      );
      if (
        (messages.status === 200 && messageData.length === 0) ||
        (messages.status === 200 &&
          messages.data.messages[0].messageUser != undefined &&
          messageData[0].messageUser == undefined)
      ) {
        setMessageData(messages.data.messages);
      }
      if (messages.status != 200) {
        messageError = "Error while loading messages try again!";
      }
    } catch (err) {
      messageError = "Error while loading messages try again!";
    }
  }
  if (
    (messageData.length === 0 && messageError == "") ||
    (userContextProvider.isMember && !messageData[0].messageUser)
  ) {
    getMessages();
  }
  console.log(messageData);
  if (deleteMessage) {
    setDeleteMessage(false);
  }
  return (
    <div className="grow flex flex-col gap-2 items-center">
      {!user.status && (
        <div className="heading">
          <div className="titleName font-extrabold text-[2rem] text-center pt-5">
            Become a <span className="text-primary">Member</span> to have{" "}
            <span className="text-secondary">full access</span> to the site
          </div>
        </div>
      )}
      {messageError != "" && <small>messageError</small>}
      {messageData.length != 0 &&
        messageData.map((message) => {
          return (
            <SingleMessage
              id={message.messageTime}
              user={user}
              message={message}
              deleteMessage={setDeleteMessage}
              messageList={messageData}
              changeMessageList={setMessageData}
            />
          );
        })}
    </div>
  );
}

// function PrintMessages({user,messages}){
//     return (
//         <>
//         {messages.map((message)=)}
//         </>
//     )
// }
