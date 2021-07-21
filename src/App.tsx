import React from "react";
import Routes from "./routes";

import { AuthProvider } from "./utils/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Routes />
    </AuthProvider>
  );
}

export default App;
