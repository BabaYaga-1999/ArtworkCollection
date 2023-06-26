import "../style/todoList.css";

import { useState } from "react";
import { Link } from "react-router-dom";

import { useTodos, insertTodo, deleteTodo } from "../hooks/useTodos";
import { useComments, insertComment } from "../hooks/useComments";
import { useFavorites, addFavorite } from "../hooks/useFavorites";

import { useAuthToken } from "../AuthTokenContext";
import { useAuth0 } from "@auth0/auth0-react";

function TodoItem({item, email, accessToken, deleteItem, isAuthenticated}) {
  const [newCommentText, setNewCommentText] = useState("");
  const [comments, setComments] = useComments(item.id);
  const [favorites, setFavorites] = useFavorites(item.id);
  const { loginWithRedirect } = useAuth0(); // Get loginWithRedirect

  const handleCommentFormSubmit = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      loginWithRedirect(); // Prompt the user to log in
      return;
    }

    if (!newCommentText) return;

    const newComment = await insertComment(item.id, newCommentText, accessToken);
    if (newComment) {
      setComments([...comments, newComment]);
      setNewCommentText("");
    }
  };

  const handleFavoriteClick = async (e) => {
    e.preventDefault();

    if (!isAuthenticated) {
      loginWithRedirect(); // Prompt the user to log in
      return;
    }

    const newFavorite = await addFavorite(item.id, accessToken);
    if (newFavorite) {
      setFavorites([...favorites, newFavorite]);
    }
  };

  return (
    <li key={item.id} className="todo-item">
      <h2><Link to={`/app/details/${item.id}`}>{item.title}</Link></h2>
      {email === 'jameswangyucheng@foxmail.com' && 
        <button onClick={() => deleteItem(item.id)}>Delete</button>
      }
      <button 
        onClick={(e) => handleFavoriteClick(e)} 
        value={item.id}
      >
        ❤️ Favorite
      </button>
      <form 
        onSubmit={handleCommentFormSubmit}
        autoComplete="off"
      >
        <input
          type="text"
          name="comment"
          value={newCommentText}
          placeholder="Enter a new comment..."
          onChange={(e) => setNewCommentText(e.target.value)}
        />
        <button type="submit">+ Add Comment</button>
      </form>
    </li>
  );
}

export default function Todos() {
  const [newItemText, setNewItemText] = useState("");
  const [todosItems, setTodosItems] = useTodos();
  const { accessToken, email, isAuthenticated } = useAuthToken();

  const handleNewItemFormSubmit = async (e) => {
    e.preventDefault();

    if (!newItemText) return;

    const newItem = await insertTodo(accessToken, newItemText);
    if (newItem) {
      setTodosItems([...todosItems, newItem]);
      setNewItemText("");
    }
  };
    
   const handleDeleteClick = async (itemId) => {
    const success = await deleteTodo(accessToken, itemId);
    if (success) {
      setTodosItems(todosItems.filter((item) => item.id !== itemId));
    }
  };

  return (
    <div className="todo-list">
      {email === 'jameswangyucheng@foxmail.com' &&
        <form className="todo-form" onSubmit={handleNewItemFormSubmit} autoComplete="off">
          <input
            type="text"
            name="item"
            placeholder="Enter a new item..."
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
          />
          <button type="submit">+ Add Item</button>
        </form>
      }
      <ul className="list">
        {todosItems.map((item) => {
          return (
            <TodoItem 
              key={item.id}
              item={item}
              email={email} // Pass the email down to TodoItem
              accessToken={accessToken}
              deleteItem={handleDeleteClick}
              isAuthenticated={isAuthenticated}  // Pass isAuthenticated prop to TodoItem
            />
          );
        })}
      </ul>
    </div>
  );
}
