import { useState, useEffect } from 'react';
import '../style/twitter.css';

export default function Twitter() {
  const [userData, setUserData] = useState(null);
  const [userTweets, setUserTweets] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const url = 'https://twitter135.p.rapidapi.com/v2/UserByScreenName/?username=Aimer_and_staff';
      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': 'a21005828fmsh589ca7cd70d900ap1e8221jsn3cc89ed95386',
          'X-RapidAPI-Host': 'twitter135.p.rapidapi.com'
        }
      };

      try {
        const response = await fetch(url, options);
        const result = await response.json();
        setUserData(result.data.user.result.legacy);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchUserTweets = async () => {
      const url = 'https://twitter135.p.rapidapi.com/v2/UserTweets/?id=213970510&count=40';
      const options = {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': 'a21005828fmsh589ca7cd70d900ap1e8221jsn3cc89ed95386',
          'X-RapidAPI-Host': 'twitter135.p.rapidapi.com'
        }
      };

      try {
        const response = await fetch(url, options);
        const result = await response.json();
        const tweets = result.data.user.result.timeline_v2.timeline.instructions[2].entry.content.itemContent.tweet_results.result.legacy;
        setUserTweets(tweets);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchUserTweets();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!userData) {
    return <div>Loading...</div>;
  }

  if (!userTweets) {
    return <div>Loading...</div>;
  }

  return (
    <div className="twitter">
      <h2>
        <a href={`https://twitter.com/${userData.screen_name}`} target="_blank" rel="noopener noreferrer">
          {userData.name}
        </a>
      </h2>
      <img src={userData.profile_image_url_https} alt={userData.name} />
      <p>Followers: {userData.followers_count}</p>
      <p>Location: {userData.location}</p>
      <p>Description: {userData.description}</p>
      <br />

      {userTweets && 
        <div className="twitter-tweet">
          <p>Pinned Tweet:</p>
          <p>{userTweets.full_text}</p>
          <p>Liked by: {userTweets.favorite_count}</p>
        </div>
      }
    </div>
  );
}
