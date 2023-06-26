import { useState, useEffect } from "react";
import { useAuthToken } from "../AuthTokenContext";

export function useFavorites(todoId) {
  const [favorites, setFavorites] = useState([]);
  const { accessToken } = useAuthToken();

  useEffect(() => {
    async function getFavoritesFromApi() {
      console.log('Getting favorites by item id: ', todoId);
      const data = await fetch(`${process.env.REACT_APP_API_URL}/todos/${todoId}/favorites`);
      const fetchedFavorites = await data.json();

      setFavorites(fetchedFavorites);
    }

    getFavoritesFromApi();
  }, [accessToken, todoId]);

  return [favorites, setFavorites];
}

  export async function addFavorite(todoItemId, accessToken) {

    console.log("Fetching todos with access token: ", accessToken);
    console.log("Todo ID: ", todoItemId);
    const data = await fetch(`${process.env.REACT_APP_API_URL}/todos/${todoItemId}/favorites`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (data.ok) {
      const favorite = await data.json();
      return favorite;
    } else {
      return null;
    }
  }
