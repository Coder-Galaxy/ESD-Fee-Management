import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./styles/styles.css";
import App from "./App";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { AuthProvider } from "./context/AuthContext";

const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID || "";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);

