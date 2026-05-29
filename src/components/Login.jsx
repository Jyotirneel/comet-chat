import { useState } from 'react';

// CometChat demo apps ship these 5 built-in UIDs by default.
// If you created your own users, replace these with your UIDs.
const DEMO_USERS = [
  { uid: 'cometchat-uid-1', name: 'Andrew Joseph', avatar: '🦾' },
  { uid: 'cometchat-uid-2', name: 'George Alan', avatar: '🛡️' },
  { uid: 'cometchat-uid-3', name: 'Nancy Grace', avatar: '🕷️' },
  { uid: 'cometchat-uid-4', name: 'Susan Marie', avatar: '⚡' },
  { uid: 'cometchat-uid-5', name: 'John Paul', avatar: '👁️' },
];

export default function Login({ onLogin }) {
  const [uid, setUid]         = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState(null);

  const handleLogin = async (loginUid) => {
    setLoading(true);
    setError(null);
    try {
      await onLogin(loginUid || uid.trim());
    } catch (err) {
      setError(err.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* Brand */}
        <div className="login-brand">
          <span className="brand-comet">☄</span>
          <h1>CometChat</h1>
          <p className="brand-sub">Real-time messaging demo</p>
        </div>

        {/* Quick-pick demo users */}
        <section>
          <p className="section-label">Pick a demo user</p>
          <div className="user-grid">
            {DEMO_USERS.map((u) => (
              <button
                key={u.uid}
                className="user-card"
                onClick={() => handleLogin(u.uid)}
                disabled={loading}
              >
                <span className="user-avatar">{u.avatar}</span>
                <span className="user-name">{u.name}</span>
                <span className="user-uid">{u.uid}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Custom UID */}
        <section>
          <p className="section-label">Or enter a custom UID</p>
          <div className="uid-row">
            <input
              className="uid-input"
              type="text"
              placeholder="e.g. alice"
              value={uid}
              onChange={(e) => setUid(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && uid && handleLogin()}
              disabled={loading}
            />
            <button
              className="uid-btn"
              onClick={() => handleLogin()}
              disabled={loading || !uid.trim()}
            >
              {loading ? '…' : 'Login'}
            </button>
          </div>
        </section>

        {error && <p className="login-error">⚠ {error}</p>}

        <p className="login-hint">
          Open a second window / incognito tab and log in as a different user to
          exchange messages.
        </p>
      </div>
    </div>
  );
}