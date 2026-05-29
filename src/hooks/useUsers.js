import { useState, useEffect } from 'react';
import { CometChat } from '../cometchat';

/**
 * Fetches the list of all users (excluding the logged-in user).
 */
export function useUsers() {
  const [users, setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    const request = new CometChat.UsersRequestBuilder()
      .setLimit(30)
      .build();

    request.fetchNext()
      .then((list) => {
        setUsers(list);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Could not load users');
        setLoading(false);
      });
  }, []);

  return { users, loading, error };
}