import { useState, useEffect } from 'react';
import { useAuthToken } from "../AuthTokenContext";
import { useAuth0 } from "@auth0/auth0-react";

export function useUser() {
  const [localUser, setLocalUser] = useState(null);
  const { accessToken } = useAuthToken();
  const { isAuthenticated } = useAuth0();

  useEffect(() => {
    async function fetchLocalUser() {
      console.log("Getting all user info...");
      if (!isAuthenticated) return;
      const response = await fetch(`${process.env.REACT_APP_API_URL}/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log(response);
      const data = await response.json();
      console.log(data);
      setLocalUser(data);
    };

    if (accessToken)
    {
      fetchLocalUser();
    }
  }, [accessToken]);

  return [localUser, setLocalUser];
}
