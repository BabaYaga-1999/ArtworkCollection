import { useState, useEffect } from "react";
import { useAuthToken } from "../AuthTokenContext";
import { useAuth0 } from "@auth0/auth0-react";

export function useTodos() {
  const [todosItems, setTodosItems] = useState([]);
  // const [recentArtwork, setRecentArtwork] = useState(null);
  const [recentFavorite, setRecentFavorite] = useState(null);
  const [recentComment, setRecentComment] = useState(null);
  const [recentUserFavorite, setRecentUserFavorite] = useState(null);
  const [recentUserComment, setRecentUserComment] = useState(null);
  const { accessToken } = useAuthToken();
  const { getAccessTokenSilently, isAuthenticated, user } = useAuth0();

  useEffect(() => {
    async function getTodosFromApi() {
      console.log("Getting all todos...");
      const data = await fetch(`${process.env.REACT_APP_API_URL}/todos`);
      const fetchedTodos = await data.json();
      setTodosItems(fetchedTodos);
    }

    // async function getRecentArtwork() {
    //   console.log("Getting rencent artwork...");
    //   const response = await fetch(`${process.env.REACT_APP_API_URL}/todos/recent`);
    //   const fetchedArtwork = await response.json();
    //   console.log(fetchedArtwork);
    //   setRecentArtwork(fetchedArtwork);
    // }

    async function getRecentFavorite() {
      console.log("Getting rencent favorite...");
      const response = await fetch(`${process.env.REACT_APP_API_URL}/favorites/recent`);
      const fetchedFavorite = await response.json();
      console.log(fetchedFavorite);
      setRecentFavorite(fetchedFavorite);
    }

    async function getRecentCommentFromApi() {
      console.log("Getting rencent comment...");
      const response = await fetch(`${process.env.REACT_APP_API_URL}/comments/recent`);
      const fetchedComment = await response.json();
      console.log(fetchedComment);
      setRecentComment(fetchedComment);
    }

    async function getRecentUserFavoriteFromApi() {
      console.log("Getting rencent user favorite...");
      if (!isAuthenticated) return;

      const data = await fetch(`${process.env.REACT_APP_API_URL}/users/${user.sub}/favorites/recent`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const fetchedUserFavorite = await data.json();
      console.log('fetchedUserFavorite', fetchedUserFavorite);
      setRecentUserFavorite(fetchedUserFavorite);
    }

    async function getRecentUserCommentFromApi() {
      console.log("Getting rencent user comment...");
      if (!isAuthenticated) return;

      const data = await fetch(`${process.env.REACT_APP_API_URL}/users/${user.sub}/comments/recent`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const fetchedUserComment = await data.json();
      console.log('fetchedUserComment', fetchedUserComment);
      setRecentUserComment(fetchedUserComment);
    }

    getTodosFromApi();
    getRecentFavorite();
    getRecentCommentFromApi();
    // getRecentArtwork();
    if (accessToken) {
      if (isAuthenticated) {
        getRecentUserFavoriteFromApi();
        getRecentUserCommentFromApi();
      }
    }
  }, [accessToken, isAuthenticated, user]);

  return [todosItems, setTodosItems, recentFavorite, recentComment, recentUserFavorite, recentUserComment];
}

  export async function insertTodo(accessToken, text) {
    const data = await fetch(`${process.env.REACT_APP_API_URL}/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        title: text,
      }),
    });
    if (data.ok) {
      const todoItem = await data.json();
      return todoItem;
    } else {
      return null;
    }
  }
  
  export async function deleteTodo(accessToken, todoItemId) {
    const data = await fetch(`${process.env.REACT_APP_API_URL}/todos/${todoItemId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (data.ok) {
      return true;
    } else {
      return false;
    }
  }

  export async function getTodoById(todoItemId) {
  const data = await fetch(`${process.env.REACT_APP_API_URL}/todos/${todoItemId}`, {
    method: "GET",
  });
  if (data.ok) {
    const todoItem = await data.json();
    return todoItem;
  } else {
    return null;
  }
}
