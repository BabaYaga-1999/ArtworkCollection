import React from "react";
import * as ReactDOMClient from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Todos from "./components/Todos";
import TodoDetail from "./components/TodoDetail";
import Profile from "./components/Profile";
import NotFound from "./components/NotFound";
import Home from "./components/Home";
import VerifyUser from "./components/VerifyUser";
import AuthDebugger from "./components/AuthDebugger";
import { Auth0Provider, useAuth0 } from "@auth0/auth0-react";
import { AuthTokenProvider } from "./AuthTokenContext";
import "./style/normalize.css";
import "./style/index.css";
import { useLocation } from 'react-router-dom';
import Twitter from "./components/Twitter";

const container = document.getElementById("root");

const requestedScopes = [
  "profile",
  "email",
  "read:todoitem",
  "read:user",
  "edit:todoitem",
  "edit:user",
  "delete:todoitem",
  "delete:user",
  "write:user",
  "write:todoitem",
];

function RequireAuth({ children }) {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();
  const location = useLocation();

  if (!isLoading && !isAuthenticated) {
    // return <Navigate to="/" replace />;
    
    // store the target location in local storage
    localStorage.setItem('returnTo', location.pathname);
    loginWithRedirect({ appState: { returnTo: location.pathname } });
    return null;
  }

  return children;
}

const root = ReactDOMClient.createRoot(container);

root.render(
  <React.StrictMode>
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
      authorizationParams={{
        redirect_uri: `${window.location.origin}/verify-user`,
        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
        scope: requestedScopes.join(" "),
      }}
    >
      <AuthTokenProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/verify-user" element={<VerifyUser />} />

            <Route path="/app" element={<AppLayout />}>
              <Route index element={<Todos />} />
              <Route path="twitter" element={<Twitter />} />
              <Route path="profile" element={<RequireAuth><Profile /></RequireAuth>} />
              <Route path="debugger" element={<RequireAuth><AuthDebugger /></RequireAuth>} />
              <Route path="details/:id" element={<TodoDetail />} />
            </Route>

            <Route path="guest" element={<AppLayout />}>
              <Route index element={<Todos />} />
              <Route path="details/:id" element={<TodoDetail />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthTokenProvider>
    </Auth0Provider>
  </React.StrictMode>
);
