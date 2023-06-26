import "../style/appLayout.css";

import { useEffect } from "react";
import { useAuthToken } from "../AuthTokenContext";
import { useNavigate } from "react-router-dom";

export default function VerifyUser() {
  const navigate = useNavigate();
  const { accessToken } = useAuthToken();

  console.log('from verify user', accessToken)

  useEffect(() => {
    async function verifyUser() {
      const data = await fetch(`${process.env.REACT_APP_API_URL}/verify-user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const user = await data.json();
      
      if (user.auth0Id) {
        // navigate("/app");
        // fetch the local target location, if not exist, go to /app
        const returnTo = localStorage.getItem('returnTo') || '/app';
        navigate(returnTo);
        localStorage.removeItem('returnTo'); // remove the used target location
      }
    }

    if (accessToken) {
      verifyUser();
    }
  }, [accessToken]);

  return <div className="loading">Loading...</div>;
}
