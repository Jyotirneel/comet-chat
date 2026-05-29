import { useState, useEffect } from 'react';
import { initCometChat, loginUser, logoutUser, CometChat } from './cometchat';
import Login from './components/Login';
import ChatShell from './components/ChatShell';
import './styles/global.css';

export default function App() {
  const [view, setView]   = useState('loading'); // 'loading' | 'login' | 'chat'
  const [me, setMe]       = useState(null);
  const [initErr, setInitErr] = useState(null);

  // ── Bootstrap CometChat once ─────────────────────────────────────────────
  useEffect(() => {
    initCometChat()
      .then(() => CometChat.getLoggedinUser())
      .then((user) => {
        if (user) { setMe(user); setView('chat'); }
        else       setView('login');
      })
      .catch((err) => {
        setInitErr(err.message);
        setView('login');
      });
  }, []);

  const handleLogin = async (uid) => {
    const user = await loginUser(uid);
    setMe(user);
    setView('chat');
  };

  const handleLogout = async () => {
    await logoutUser();
    setMe(null);
    setView('login');
  };

  if (view === 'loading') return <Splash />;
  if (initErr)            return <Fatal message={initErr} />;
  if (view === 'login')   return <Login onLogin={handleLogin} />;
  return <ChatShell me={me} onLogout={handleLogout} />;
}

function Splash() {
  return (
    <div className="splash">
      <div className="splash-dot" />
      <span>Connecting…</span>
    </div>
  );
}

function Fatal({ message }) {
  return (
    <div className="fatal">
      <h2>Setup required</h2>
      <pre>{message}</pre>
      <p>
        Copy <code>.env.example</code> → <code>.env</code> and add your{' '}
        <a href="https://app.cometchat.com" target="_blank" rel="noreferrer">
          CometChat credentials
        </a>
        .
      </p>
    </div>
  );
}