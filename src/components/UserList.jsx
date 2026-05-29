import { useEffect, useState } from 'react';
import { useUsers } from '../hooks/useUsers';
import { CometChat } from '../cometchat';

const PRESENCE_ID = 'presence-' + Date.now();

export default function UserList({ currentUID, selectedUID, onSelect }) {
  const { users, loading, error } = useUsers();
  const [online, setOnline] = useState({});

  // ── Track presence ──────────────────────────────────────────────────────
  useEffect(() => {
    CometChat.addUserListener(
      PRESENCE_ID,
      new CometChat.UserListener({
        onUserOnline(u)  { setOnline(p => ({ ...p, [u.getUid()]: true })); },
        onUserOffline(u) { setOnline(p => ({ ...p, [u.getUid()]: false })); },
      })
    );
    return () => CometChat.removeUserListener(PRESENCE_ID);
  }, []);

  if (loading) return <div className="list-state">Loading…</div>;
  if (error)   return <div className="list-state error">{error}</div>;

  const peers = users.filter((u) => u.getUid() !== currentUID);

  if (peers.length === 0)
    return (
      <div className="list-state">
        No other users found. Create more users in your CometChat dashboard.
      </div>
    );

  return (
    <ul className="user-list">
      {peers.map((u) => {
        const uid  = u.getUid();
        const name = u.getName() || uid;
        const isOnline = online[uid] ?? u.getStatus() === 'online';
        const isActive = uid === selectedUID;

        return (
          <li key={uid}>
            <button
              className={`user-row ${isActive ? 'active' : ''}`}
              onClick={() => onSelect(uid, name)}
            >
              <span className="user-row-avatar">
                {name[0].toUpperCase()}
              </span>
              <span className="user-row-info">
                <span className="user-row-name">{name}</span>
                <span className="user-row-uid">{uid}</span>
              </span>
              <span
                className={`presence-dot ${isOnline ? 'online' : 'offline'}`}
                title={isOnline ? 'Online' : 'Offline'}
              />
            </button>
          </li>
        );
      })}
    </ul>
  );
}