import { useState, useEffect } from "react";
import { useAuthToken } from "../AuthTokenContext";

export function useComments(todoId) {
  const [comments, setComments] = useState([]);
  const { accessToken } = useAuthToken();
  
  useEffect(() => {
    async function getCommentsFromApi() {
      console.log('Getting comments by item id: ', todoId);
      const data = await fetch(`${process.env.REACT_APP_API_URL}/todos/${todoId}/comments`);
      const fetchedComments = await data.json();

      setComments(fetchedComments);
    }

    getCommentsFromApi();
  }, [accessToken, todoId]);

  return [comments, setComments];
}
  export async function insertComment(todoItemId, text, accessToken) {
    const data = await fetch(`${process.env.REACT_APP_API_URL}/todos/${todoItemId}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        text: text,
      }),
    });
    if (data.ok) {
      const comment = await data.json();
      return comment;
    } else {
      return null;
    }
  }
