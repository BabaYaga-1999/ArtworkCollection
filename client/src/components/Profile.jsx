import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useUser } from '../hooks/useUser';
import { useAuthToken } from '../AuthTokenContext';
import { Link } from 'react-router-dom';
import '../style/profile.css';  // 引入新的CSS样式

function ChangeName() {
  const { user } = useAuth0();
  const [name, setName] = useState("");
  const { accessToken } = useAuthToken();

  const handleChange = (event) => {
    setName(event.target.value);
  }

  const handleSubmit = () => {
    if (!name) {
      alert('Please input a name.');
      return;
    }
    fetch(`${process.env.REACT_APP_API_URL}/changeName`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        auth0Id: user.sub,
        name: name
      })
    })
    .then((response) => response.json())
    .then((data) => {
      alert(data.status);
      window.location.reload();
    });
  }

  return (
    <div className="changeName">
      <input type="text" value={name} onChange={handleChange} placeholder="New name" />
      <button onClick={handleSubmit}>Change Name</button>
    </div>
  );
}

function ChangePlan() {
  const { user } = useAuth0();
  const [plan, setPlan] = useState("FREE");
  const { accessToken } = useAuthToken();

  const handleChange = (event) => {
    setPlan(event.target.value);
  }

  const handleSubmit = () => {
    fetch(`${process.env.REACT_APP_API_URL}/changePlan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        auth0Id: user.sub,
        plan: plan
      })
    })
    .then((response) => response.json())
    .then((data) => {
      alert(data.status);
      window.location.reload();
    });
  }

  return (
    <div className="changePlan">
      <select value={plan} onChange={handleChange}>
        <option value="FREE">Free</option>
        <option value="BASIC">Basic</option>
        <option value="PRO">Pro</option>
        <option value="MAX">Max</option>
      </select>
      <button onClick={handleSubmit}>Change Plan</button>
    </div>
  );
}

export default function Profile() {
  const { user } = useAuth0();
  const [localUser] = useUser();

  if (!localUser) {
    return <div>Loading...</div>;
  }

  // 检查 localUser 的属性，例如 email
  if (!localUser.email) {
    return <div>Loading email...</div>;
  }

  console.log(localUser.favorites)
  console.log(localUser.comments)

  return (
    <div className="profile">
      <div>
        <p>Name: {localUser.name} <ChangeName /></p>
      </div>
      <div>
        <img src={user.picture} alt="profile avatar" />
      </div>
      <div>
        <p>📧 Email: {user.email}</p>
      </div>
      <div>
        <p>🔑 Auth0Id: {user.sub}</p>
      </div>
      <div>
        <p>✅ Email verified: {user.email_verified?.toString()}</p>
      </div>
      <div>
        <p>Current Plan: {localUser.currentPlan} <ChangePlan /></p>
      </div>
      {localUser.email === 'jameswangyucheng@foxmail.com' && (
        <div>
          <h2>My Artworks</h2>
          <ul>
            {localUser.todos.map(todo => 
              <li key={todo.id}>
                <Link to={`/app/details/${todo.id}`}>{todo.title}</Link>
              </li>
            )}
          </ul>
        </div>
      )}
      <div>
        <h2>My Comments</h2>
        <ul>
          {localUser.comments.map(comment => (
            <li key={comment.id}>
              <Link to={`/app/details/${comment.todoItemId}`}>{comment.text}</Link>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>My Favorites</h2>
        <ul>
          {localUser.favorites.map(favorite => (
            <li key={favorite.id}>
              <Link to={`/app/details/${favorite.todoItemId}`}>{favorite.todoItem.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

