import '../style/todoDetail.css';
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getTodoById } from "../hooks/useTodos";  // import getTodoById

const TodoDetail = () => {
  const { id } = useParams();
  const [todoDetail, setTodoDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  async function fetchTodoDetail() {
    setIsLoading(true);
    const fetchedTodoDetail = await getTodoById(id);
    setTodoDetail(fetchedTodoDetail);
    setIsLoading(false);
  }

  useEffect(() => {
    fetchTodoDetail();
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!todoDetail) {
    return <div>Todo not found</div>;
  }

  return (
    <div className="todo-detail">
      <h2 className="todo-title">{todoDetail.title}</h2>
      <p>Created at: {new Date(todoDetail.createdAt).toLocaleString()}</p>
      <p>Last updated at: {new Date(todoDetail.updatedAt).toLocaleString()}</p>
      <p>Completed: {todoDetail.completed ? 'Yes' : 'No'}</p>
      <p>Number of ❤️ Favorite: {todoDetail.favorites.length}</p>
      <div className="comment-section">
        {todoDetail.comments.map((comment) => (
          <div className="comment" key={comment.id}>
            <h3 className="comment-author">Comment by {comment.author.name}</h3>
            <p className="comment-text">{comment.text}</p>
            <p>Posted at: {new Date(comment.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoDetail;
