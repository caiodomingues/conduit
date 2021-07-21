/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { SyntheticEvent, useState } from "react";
import { useEffect } from "react";
import { useHistory } from "react-router";
import api from "../../services/api";
import { UserProps } from "../../types";
import { useAuth } from "../../utils/AuthContext";

const Settings: React.FC = () => {
  const { getUser, setSigned, saveUser, deleteUser } = useAuth();

  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [image, setImage] = useState<string>("");
  const [user, setUser] = useState<UserProps>();

  const history = useHistory();

  useEffect(() => {
    const data = async () => {
      setUser(await getUser!());
      setUsername(user?.username || "");
      setEmail(user?.email || "");
      setPassword(user?.password || "");
      setBio(user?.bio || "");
      setImage(user?.image || "");
      setPassword(user?.password || "");
    };

    data();
  }, [getUser, user]);

  const handleLogout = () => {
    deleteUser!();
    setSigned!(false);
  };

  const handleUpdate = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    api
      .put(`/user`, { user: { username, email, bio, image } })
      .then((response) => {
        saveUser!(response.data.user.token, response.data.user);
        history.push(`/@${user?.username}`);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="settings-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Your Settings</h1>

            <form onSubmit={handleUpdate}>
              <fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="URL of profile picture"
                    defaultValue={user?.image || ""}
                    onChange={(e) => setImage(e.target.value)}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    placeholder="Your Name"
                    defaultValue={user?.username || ""}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <textarea
                    className="form-control form-control-lg"
                    rows={8}
                    placeholder="Short bio about you"
                    onChange={(e) => setBio(e.target.value)}
                    defaultValue={user?.bio || ""}
                  ></textarea>
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="text"
                    placeholder="Email"
                    defaultValue={user?.email || ""}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="password"
                    placeholder="Password"
                    defaultValue={user?.password || ""}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </fieldset>
                <button
                  type="submit"
                  className="btn btn-lg btn-primary pull-xs-right"
                >
                  Update Settings
                </button>
              </fieldset>
            </form>
            <hr />
            <button className="btn btn-outline-danger" onClick={handleLogout}>
              Or click here to logout.
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
