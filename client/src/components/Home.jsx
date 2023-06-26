import "../style/home.css";
import { Link } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import { useNavigate } from "react-router-dom";
import { useTodos } from "../hooks/useTodos";

export default function Home() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth0();
  const signUp = () => loginWithRedirect({ screen_hint: "signup" });

  const [todosItems, setTodosItems, recentFavorite, recentComment, recentUserFavorite, recentUserComment] = useTodos();

  const RecentArtwork = ({title, data}) => (
    <div className="content-section">
      <h2>{title}</h2>
      {data && (
        <Link to={`/app/details/${data.todoItem.id}`}>
          {data.todoItem.title}
        </Link>
      )}
    </div>
  );

  const RecentComment = ({title, data}) => (
    <div className="content-section">
      <h2>{title}</h2>
      {data && (
        <>
          <p>{data.text}</p>
          <Link to={`/app/details/${data.todoItem.id}`}>View Related Artwork</Link>
        </>
      )}
    </div>
  );

  return (
    <div className="home">
      <h1>Artwork Collection</h1>

      <RecentArtwork title="Most Recent Favorite Artwork" data={recentFavorite}/>
      <RecentComment title="Most Recent Comment" data={recentComment}/>
      
      {isAuthenticated && (
        <>
          <RecentArtwork title="Your Recent Favorite Artwork" data={recentUserFavorite}/>
          <RecentComment title="Your Recent Comment" data={recentUserComment}/>
        </>
      )}

      <div>
        {!isAuthenticated ? (
          <>
            <button className="btn-primary" style={{marginRight: "10px"}} onClick={loginWithRedirect}>
              Login
            </button>
            <button className="btn-secondary" style={{marginRight: "10px"}} onClick={() => navigate("/guest")}>
              Enter App as a Guest
            </button>
            <button className="btn-secondary" onClick={signUp}>
              Create Account
            </button>
          </>
        ) : (
          <>
            {/* <button
              className="exit-button"
              style={{marginRight: "10px"}}
              onClick={() => navigate("/app")}
            >
              LogOut
            </button> */}
            <button className="exit-button" onClick={() => {logout({ returnTo: window.location.origin });}}>
                LogOut
              </button>
            <button className="btn-primary" style={{marginRight: "10px"}} onClick={() => navigate("/app")}>
              Enter App
            </button>
            <button className="btn-secondary" onClick={signUp}>
              Create Account
            </button>
          </>
        )}
      </div>
    </div>
  );
}
