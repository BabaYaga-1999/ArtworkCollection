import "../style/appLayout.css";

import { Outlet, Link } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { useUser } from '../hooks/useUser';
import { useNavigate } from "react-router-dom";

export default function AppLayout() {
  const { user, isAuthenticated, isLoading, loginWithRedirect, logout } = useAuth0();
  const signUp = () => loginWithRedirect({ screen_hint: "signup" });
  const [localUser] = useUser();
  const navigate = useNavigate();

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="app">
      <div className="title">
        <h1>Artwork Collection</h1>
      </div>
      <div className="header">
        <nav className="menu">
          <ul className="menu-list">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to={isAuthenticated ? "/app" : "/guest"}>Artworks</Link>
            </li>
            <li>
              <Link to="/app/twitter">Twitter</Link>
            </li>
            <li>
              <Link to="/app/profile">Profile</Link>
            </li>
            <li>
              <Link to="/app/debugger">Auth Debugger</Link>
            </li>
          </ul>
        </nav>
        <div className="menu-list">
          Welcome 👋 {isAuthenticated ? (localUser ? localUser.name : 'Loading...') : 'Guest'} 
        </div>
        <ul className="menu-list auth-buttons">
          <li>
            {isAuthenticated ? (
              <button className="exit-button" onClick={() => {logout({ returnTo: window.location.origin });}}>
                LogOut
              </button>
            ) : (
              <>
                <button className="btn-primary" style={{marginRight: "10px"}} onClick={loginWithRedirect}>
                  Login
                </button>
                <button className="btn-secondary" onClick={signUp}>
                  Create Account
                </button>
              </>
            )}
          </li>
        </ul>
      </div>
      <div className="content">
        <Outlet />
      </div>
    </div>
  );
}
