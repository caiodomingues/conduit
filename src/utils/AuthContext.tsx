import React, { useState, useEffect, useContext, createContext } from "react";
import api from "../services/api";

import { AuthContextProps, UserProps } from "../types";

const AuthContext = createContext<Partial<AuthContextProps>>({});

export function AuthProvider({ children }: any) {
  const [user, setUser] = useState<UserProps>();
  const [signed, setSigned] = useState<boolean>(false);

  useEffect(() => {
    async function loadStorageData() {
      const storagedToken = localStorage.getItem("conduit_token");
      const _user = localStorage.getItem("conduit_user");

      if (storagedToken) {
        setSigned(true);
        api.defaults.headers.Authorization = `Token ${storagedToken}`;
        setUser(JSON.parse(_user!));
      } else {
        setSigned(false);
      }
    }
    loadStorageData();
  }, []);

  async function saveUser(token: string, user: UserProps) {
    localStorage.setItem("conduit_token", token);
    localStorage.setItem("conduit_user", JSON.stringify(user));
    api.defaults.headers.Authorization = `Token ${token}`;
    setSigned(true);
  }

  async function deleteUser() {
    localStorage.removeItem("conduit_token");
    localStorage.removeItem("conduit_user");
    api.defaults.headers.Authorization = "";
    setSigned(false);
  }

  async function getUser() {
    return user;
  }

  return (
    <AuthContext.Provider
      value={{
        signed,
        getUser,
        deleteUser,
        saveUser,
        setSigned,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}

export default AuthContext;
