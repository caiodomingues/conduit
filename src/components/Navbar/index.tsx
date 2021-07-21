import React, { useState } from "react";
import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { UserProps } from "../../types";
import { useAuth } from "../../utils/AuthContext";

function Navbar() {
  const { signed, getUser } = useAuth();
  const { pathname } = useLocation();
  const [user, setUser] = useState<UserProps>();

  useEffect(() => {
    const data = async () => {
      setUser(await getUser!());
    };
    data();
  }, [getUser]);

  return (
    <nav className="navbar navbar-light">
      <div className="container">
        <a className="navbar-brand" href="index.html">
          conduit
        </a>
        <ul className="nav navbar-nav pull-xs-right">
          <li className="nav-item">
            <Link className={`nav-link ${pathname === "/" && "active"}`} to="/">
              Home
            </Link>
          </li>
          {signed && (
            <>
              <li className="nav-item">
                <Link
                  className={`nav-link ${pathname === "/editor" && "active"}`}
                  to="/editor"
                >
                  <i className="ion-compose"></i>&nbsp;New Article
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${pathname === "/settings" && "active"}`}
                  to="/settings"
                >
                  <i className="ion-gear-a"></i>&nbsp;Settings
                </Link>
              </li>
            </>
          )}

          {signed ? (
            <li className="nav-item">
              <Link
                className={`nav-link ${pathname[1] === "@" && "active"}`}
                to={`/@${user?.username}`}
              >
                <img src={user?.image} alt="" className="user-pic" />
                {user?.username}
              </Link>
            </li>
          ) : (
            <>
              <li className="nav-item">
                <Link
                  className={`nav-link ${pathname === "/login" && "active"}`}
                  to="/login"
                >
                  Sign in
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className={`nav-link ${pathname === "/register" && "active"}`}
                  to="/register"
                >
                  Sign up
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
