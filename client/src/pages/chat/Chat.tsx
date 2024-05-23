/* eslint-disable @typescript-eslint/no-explicit-any */
import Page from "components/Page";
import "./chat.css";
import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "src/redux/hooks";
import axios from "axios";
import { setSnack } from "src/redux/reducers/snack.reducer";
import { Modal } from "react-bootstrap";
import { get, uniqBy } from "lodash";
import moment from "moment";
import { Icon } from "@iconify/react";

export default function Chat() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [activeUser, setActiveUser] = useState("");
  const [showMediaDialog, setShowMediaDialog] = useState(false);
  const { user, socket, chats } = useAppSelector((state) => ({
    user: state.auth.user,
    chats: state.chats.chats,
    socket: state.socket.socket,
  }));
  const previewImg =
    "https://static.turbosquid.com/Preview/001292/481/WV/_D.jpg";
    const activeUserDetails = useMemo(() => {
    return user?.friends.find((friend) => friend.email === activeUser);
    },[activeUser, user?.friends])

  const [chatMessage, setChatMessage] = useState("");
  const [media, setMedia] = useState<any>(null);

  const handleActiveUser = async (email: string) => {
    setActiveUser(email);
    navigate(`/chat?selected=${email}`);
    if (socket) {
      socket.emit("get-messages-request", {
        sender: user?.email,
        receiver: email,
      });
    }
  };

  function convertFileToDataURL(file: any) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }

  async function handleChatMessage(data: any) {
    let chatObj: any = {
      sender: user?.email,
      receiver: activeUser,
      message: data,
      type: "text",
    };
    if (media) {
      chatObj = {
        ...chatObj,
        media: {
          type: media?.type,
          file: media?.file,
          name: media?.file?.name,
        },
        type: media?.type?.includes("image")
          ? "image"
          : media?.type?.includes("video")
          ? "video"
          : "text",
      };
      try {
        const formData = new FormData();
        formData.append("file", media.file);
        const backendServer = `${import.meta.env.VITE_express_server}`;
        const { data } = await axios.post(`${backendServer}/upload`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        chatObj = {
          ...chatObj,
          type: media.type,
          media: data.fileUrl,
        };
      } catch (error: any) {
        dispatch(
          setSnack({ type: "error", message: error.message, open: true })
        );
      }
    }
    socket?.emit("send-message-request", chatObj);
    setChatMessage("");
    setShowMediaDialog(false);
    setMedia(null);
  }
  console.log(chats.slice(chats.length - 2));
  return (
    <Page title="chat" style={{ marginTop: 0 }}>
      <Modal
        maxWidth="sm"
        fullWidth
        show={showMediaDialog}
        onHide={() => {
          setShowMediaDialog(false);
          setMedia(null);
        }}
      >
        <Modal.Header>
          <Modal.Title>Upload media</Modal.Title>
        </Modal.Header>
        {media && (
          <>
            {media.type.includes("image") ? (
              <img src={media.url} width="100%" height={300} />
            ) : (
              <video src={media.url} width="100%" height={300} controls></video>
            )}
          </>
        )}
        <input
          className="form-control p-3"
          id="textAreaExample2"
          value={chatMessage}
          onChange={(e) => setChatMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleChatMessage(get(e, "target.value", ""));
            }
          }}
          placeholder="Type a message"
        />
      </Modal>
      <div className="container">
        <div className="content-wrapper"  style={{overflow: 'hidden'}}>
          <div className="row gutters" style={{overflow: 'hidden'}}>
            <div
              className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12"
              style={{ minHeight: "calc(100vh - 120px)", overflow: 'hidden' }}
            >
              <div className="card m-0 bg-dark">
                <div
                  className="row no-gutters"
                  style={{ minHeight: "calc(100vh - 120px)" }}
                >
                  <div className="col-xl-4 col-lg-4 col-md-4 col-sm-3 col-3">
                    <div className="users-container p-4">
                      {/* <div className="chat-search-box">
                        <div className="input-group">
                          <input
                            className="form-control"
                            placeholder="Search"
                          />
                          <div className="input-group-btn">
                            <button type="button" className="btn btn-info">
                              <i className="fa fa-search"></i>
                            </button>
                          </div>
                        </div>
                      </div> */}
                      <ul className="users">
                        {user &&
                          user.friends.map((friend) => (
                            <li
                              onClick={() => handleActiveUser(friend.email)}
                              className={`person d-flex border rounded mb-1 ${
                                activeUser === friend.email && "bg-white"
                              }`}
                              data-chat="person1"
                            >
                              <div className="user">
                                <img
                                  src={
                                    friend.photoURL ||
                                    "https://www.bootdey.com/img/Content/avatar/avatar3.png"
                                  }
                                  alt={friend.displayName}
                                />
                                {/* <span className="status busy"></span> */}
                              </div>
                              <div className="name-time">
                                <span className="name">
                                  {friend.displayName}
                                </span>
                                <br />
                                <span className="time">{friend.email}</span>
                              </div>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                  <div className="col-xl-8 col-lg-8 col-md-8 col-sm-9 col-9 bg-dark">
                    <div className="selected-user text-white">
                      <span>
                        To: <span className="name">{activeUser}</span>
                      </span>
                    </div>
                    <div className="chat-container">
                      <ul
                        className="chat-box chatContainerScroll"
                        style={{
                          maxHeight: "calc(100vh - 350px)",
                        }}
                      >
                        {uniqBy(chats, '_id').map((chat) => {
                          const friend = user?.friends.find(
                            (item) => item.email === chat.sender
                          );
                          return chat.sender === user?.email ? (
                            <li className="chat-left">
                              <div className="chat-avatar">
                                <img
                                  src={
                                    user?.photoURL ||
                                    "https://www.bootdey.com/img/Content/avatar/avatar3.png"
                                  }
                                  alt="Retail Admin"
                                />
                                <div className="chat-name">
                                  YOU
                                </div>
                              </div>
                              <div className="chat-text">
                                {chat.media && chat.type.includes("image") && (
                                  <img
                                    style={{
                                      width: 200,
                                      height: 200,
                                      objectFit: "cover",
                                      borderRadius: 8,
                                    }}
                                    src={chat.media}
                                    alt={chat.message}
                                  />
                                )}
                                {chat.media && chat.type.includes("video") && (
                                  <video
                                    style={{
                                      width: 200,
                                      height: 200,
                                      objectFit: "cover",
                                      borderRadius: 8,
                                    }}
                                    controls
                                    src={chat.media}
                                  />
                                )}
                                <p className="mb-0">{chat.message}</p>
                              </div>
                              <div className="chat-hour">
                                {moment(chat.timestamp).format("hh:mm A, DD MMM")}
                              </div>
                            </li>
                          ) : (
                            <li className="chat-right">
                              <div className="chat-hour">
                                {moment(chat.timestamp).format("hh:mm A, DD MMM")}
                              </div>
                              <div className="chat-text">
                                {chat.media && chat.type.includes("image") && (
                                  <img
                                    style={{
                                      width: 200,
                                      height: 200,
                                      objectFit: "cover",
                                      borderRadius: 8,
                                    }}
                                    src={chat.media}
                                    alt={chat.message}
                                  />
                                )}
                                <p className="mb-0">{chat.message}</p>
                              </div>
                              <div className="chat-avatar">
                                <img
                                  src={
                                    friend?.photoURL ||
                                    "https://www.bootdey.com/img/Content/avatar/avatar3.png"
                                  }
                                  alt="Retail Admin"
                                />
                                <div className="chat-name">
                                  {friend?.displayName}
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                      <div className="form-group mt-3 mb-0">
                        <div className="form-outline">
                          <input
                            type="file"
                            ref={photoInputRef}
                            accept="image/*"
                            style={{ display: "none" }}
                            id="image"
                            onChange={async (e) => {
                              const file: any = get(e, "target.files[0]", null);
                              if (file) {
                                const url = await convertFileToDataURL(file);
                                setMedia({
                                  url,
                                  type: file.type,
                                  file,
                                });
                                setShowMediaDialog(true);
                              }
                            }}
                          />
                          <input
                            type="file"
                            ref={videoInputRef}
                            accept="video/*"
                            style={{ display: "none" }}
                            id="video"
                            onChange={async (e) => {
                              const file: any = get(e, "target.files[0]", null);
                              try {
                                if (file) {
                                  const url = await convertFileToDataURL(file);
                                  setMedia({
                                    url,
                                    type: file.type,
                                    file,
                                  });
                                  setShowMediaDialog(true);
                                }
                              } catch (error: any) {
                                console.log(error.message);
                              }
                            }}
                            onAbort={(e) => {
                              console.log(e);
                            }}
                          />
                          <div className="d-flex mb-2">
                            <button
                              className="border-0"
                              onClick={() => videoInputRef.current?.click()}
                            >
                              <Icon
                                style={{ fontSize: 24 }}
                                icon="mingcute:video-fill"
                              />
                            </button>
                            <button
                              className="border-0 ms-2"
                              onClick={() => photoInputRef.current?.click()}
                            >
                              <Icon
                                style={{ fontSize: 24 }}
                                icon="ic:outline-image"
                              />
                            </button>
                          </div>
                          <input
                            className="form-control p-3"
                            id="textAreaExample2"
                            value={chatMessage}
                            onChange={(e) => setChatMessage(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                handleChatMessage(get(e, "target.value", ""));
                              }
                            }}
                            placeholder="Type a message"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Page>
  );
}
