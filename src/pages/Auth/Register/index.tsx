import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../../../services/api";
import { useAuth } from "../../../utils/AuthContext";

type Props = {
  username: string[];
  email: string[];
  password: string[];
};

const Register: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState<Props>();
  const { saveUser, setSigned } = useAuth();

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    await api
      .post("/users", { user: { username, email, password } })
      .then((response) => {
        setErrors({
          username: [],
          email: [],
          password: [],
        });
        setUsername("");
        setEmail("");
        setPassword("");

        saveUser!(response.data.user.token, response.data.user);
        setSigned!(true);
      })
      .catch((error) => {
        setErrors(error.response.data.errors);
      });
  };
  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign up</h1>
            <p className="text-xs-center">
              <Link to="/login">Have an account?</Link>
            </p>

            {errors && (
              <ul className="error-messages">
                {errors?.username?.map((error) => (
                  <li key={error}>Name {error}</li>
                ))}
                {errors?.email?.map((error) => (
                  <li key={error}>E-mail {error}</li>
                ))}
                {errors?.password?.map((error) => (
                  <li key={error}>Password {error}</li>
                ))}
              </ul>
            )}

            <form onSubmit={handleSubmit}>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="text"
                  placeholder="Your Name"
                  maxLength={20}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </fieldset>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </fieldset>
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </fieldset>
              <button className="btn btn-lg btn-primary pull-xs-right">
                Sign up
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
