import { Tab, Tabs } from "react-bootstrap";
import "./friends.css";
import { useAppDispatch, useAppSelector } from "src/redux/hooks";
import { setSnack } from "src/redux/reducers/snack.reducer";
export default function Friends() {
  const dispatch = useAppDispatch();
  const { user, socket } = useAppSelector((state) => ({
    user: state.auth.user,
    socket: state.socket.socket,
  }));
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-12">
          <div id="content" className="content content-full-width">
            <div className="profile">
              <div className="profile-header">
                <div
                  className="profile-header-cover rounded"
                  style={{
                    backgroundImage: `url(${
                      user?.cover || "https://www.bootdey.com/image/600x100/"
                    })`,
                  }}
                ></div>
                <div className="profile-header-content">
                  <div className="profile-header-img">
                    <img
                      src={
                        user?.photoURL ||
                        "https://bootdey.com/img/Content/avatar/avatar7.png"
                      }
                      alt=""
                      style={{
                        objectFit: "cover",
                        width: "100%",
                        height: 114,
                      }}
                    />
                  </div>
                  <div className="profile-header-info">
                    <h4 className="m-t-10 m-b-5">{user?.displayName}</h4>
                    <p className="m-b-10">{user?.email}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="profile-content">
              <div className="tab-content p-0">
                <div
                  className="tab-pane fade in active show"
                  id="profile-friends"
                >
                  <Tabs
                    defaultActiveKey="requests"
                    id="uncontrolled-tab-example"
                    className="mb-3"
                  >
                    <Tab
                      eventKey="requests"
                      title={`Friend requests (${user?.requests.length})`}
                    >
                      <div className="row row-space-2">
                        <h4 className="mb-4">
                          Requests ({user?.requests.length})
                        </h4>
                        {user &&
                          user.requests.map((friend) => (
                            <div className="col-md-6 m-b-2 border rounded shadow-sm">
                              <div className="p-10 bg-white">
                                <div
                                  className="media media-xs overflow-visible d-flex justify-content-between"
                                  style={{ alignItems: "center" }}
                                >
                                  <div className="media-body valign-middle d-flex valign-center">
                                    <img
                                      src={
                                        friend.photoURL ||
                                        "https://bootdey.com/img/Content/avatar/avatar1.png"
                                      }
                                      alt=""
                                      style={{
                                        width: 50,
                                        height: 50,
                                        borderRadius: 50,
                                        objectFit: "cover",
                                      }}
                                    />
                                    <div
                                      className="ms-3"
                                      style={{
                                        flexDirection: "column",
                                        justifyContent: "flex-start",
                                        textAlign: "start",
                                      }}
                                    >
                                      <b className="">{friend.displayName}</b>
                                      <br />
                                      <span>{user.email}</span>
                                    </div>
                                  </div>
                                  <div className="media-body valign-middle d-flex ms-2">
                                    <button
                                      onClick={() => {
                                        const obj = {
                                          receiver: user?._id,
                                          sender: friend._id,
                                        };
                                        socket?.emit(
                                          "accept-friend-request",
                                          obj
                                        );
                                        dispatch(
                                          setSnack({
                                            open: true,
                                            message: "Friend request accepted",
                                            type: "success",
                                          })
                                        );
                                      }}
                                      className="form-control"
                                    >
                                      Accept
                                    </button>
                                    <button
                                      onClick={() => {
                                        const obj = {
                                          receiver: user?._id,
                                          sender: friend._id,
                                        };
                                        socket?.emit(
                                          "reject-friend-request",
                                          obj
                                        );
                                        dispatch(
                                          setSnack({
                                            open: true,
                                            message: "Friend request rejected",
                                            type: "error",
                                          })
                                        );
                                      }}
                                      className="form-control ms-2"
                                    >
                                      Reject
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </Tab>
                    <Tab
                      eventKey="friends"
                      title={`Friends (${user?.friends.length})`}
                    >
                      <h4 className="m-t-0 m-b-20">
                        Friends ({user?.friends.length})
                      </h4>
                      {user &&
                        user.friends.map((friend, index: number) =>
                          index % 2 === 0 ? (
                            <div className="col-md-6 m-b-2">
                              <div className="p-10 bg-white">
                                <div
                                  className="media media-xs overflow-visible"
                                  style={{ alignItems: "center" }}
                                >
                                  <a className="media-left" href="javascript:;">
                                    <img
                                      src={
                                        friend.photoURL ||
                                        "https://bootdey.com/img/Content/avatar/avatar1.png"
                                      }
                                      alt=""
                                      className="media-object img-circle"
                                    />
                                  </a>
                                  <div className="media-body valign-middle">
                                    <b className="text-inverse">
                                      {friend.displayName}
                                    </b>
                                  </div>
                                  <div className="media-body valign-middle text-right overflow-visible">
                                    <button
                                      onClick={() => {
                                        socket?.emit("unfriend-user", {
                                          receiver: user?._id,
                                          sender: friend._id,
                                        });
                                      }}
                                      className="ms-4 form-control"
                                    >
                                      unfriend
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="col-md-6 m-b-2">
                              <div className="p-10 bg-white">
                                <div className="media media-xs overflow-visible">
                                  <a className="media-left" href="javascript:;">
                                    <img
                                      src="https://bootdey.com/img/Content/avatar/avatar3.png"
                                      alt=""
                                      className="media-object img-circle"
                                    />
                                  </a>
                                  <div className="media-body valign-middle">
                                    <b className="text-inverse">
                                      Blake Gerrald
                                    </b>
                                  </div>
                                  <div className="media-body valign-middle text-right overflow-visible"></div>
                                </div>
                              </div>
                            </div>
                          )
                        )}
                    </Tab>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
