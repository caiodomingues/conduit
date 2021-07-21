import React from "react";
import { Switch, Route, HashRouter, Redirect } from "react-router-dom";

import Footer from "./components/Footer";
import Navbar from "./components/Navbar";

import Article from "./pages/Article";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import Editor from "./pages/Editor";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import { useAuth } from "./utils/AuthContext";

function Routes() {
  const { signed } = useAuth();

  return (
    <HashRouter>
      <Navbar />
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/register">
          {signed ? <Redirect to="/" /> : <Register />}
        </Route>
        <Route path="/login">{signed ? <Redirect to="/" /> : <Login />}</Route>
        <Route path="/@:id">
          {signed ? <Profile /> : <Redirect to="/login" />}
        </Route>
        <Route path="/settings">
          {signed ? <Settings /> : <Redirect to="/login" />}
        </Route>
        <Route path="/editor/:slug?">
          {signed ? <Editor /> : <Redirect to="/login" />}
        </Route>
        <Route path="/article/:id">
          {signed ? <Article /> : <Redirect to="/login" />}
        </Route>
      </Switch>
      <Footer />
    </HashRouter>
  );
}

export default Routes;
