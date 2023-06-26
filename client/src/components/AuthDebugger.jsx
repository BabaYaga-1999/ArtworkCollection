import { useAuth0 } from "@auth0/auth0-react";
import { useAuthToken } from "../AuthTokenContext";

export default function AuthDebugger() {
  const { user } = useAuth0();
  const { accessToken } = useAuthToken();

  return (
    <div style={{maxWidth: '100%', boxSizing: 'border-box', padding: '1rem'}}>
      <div style={{overflowWrap: 'break-word'}}>
        <p>Access Token:</p>
        <pre style={{whiteSpace: 'pre-wrap', wordWrap: 'break-word'}}>{JSON.stringify(accessToken, null, 2)}</pre>
      </div>
      <div style={{overflowWrap: 'break-word'}}>
        <p>User Info</p>
        <pre style={{whiteSpace: 'pre-wrap', wordWrap: 'break-word'}}>{JSON.stringify(user, null, 2)}</pre>
      </div>
    </div>
  );
}




