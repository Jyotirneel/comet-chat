import { useState } from 'react';
import UserList from './UserList';
import MessagePane from './MessagePane';

export default function ChatShell({ me, onLogout }) {
  const [selectedUID, setSelectedUID] = useState(null);
  const [selectedName, setSelectedName] = useState(null);

  const handleSelect = (uid, name) => {
    setSelectedUID(uid);
    setSelectedName(name);
  };

  return (
    <div className="shell">
      {/* ── Sidebar ────────────────────────────────────────── */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="me-info">
            <span className="me-dot" />
            <span className="me-name">{me.getName() || me.getUid()}</span>
          </div>
          <button className="logout-btn" onClick={onLogout} title="Log out">
            ⏻
          </button>
        </div>

        <p className="sidebar-section-label">People</p>

        <UserList
          currentUID={me.getUid()}
          selectedUID={selectedUID}
          onSelect={handleSelect}
        />
      </aside>

      {/* ── Message pane ───────────────────────────────────── */}
      <main className="main">
        {selectedUID ? (
          <MessagePane
            me={me}
            receiverUID={selectedUID}
            receiverName={selectedName}
          />
        ) : (
          <div className="empty-state">
            <span className="empty-icon">☄</span>
            <p>Select someone to start chatting</p>
          </div>
        )}
      </main>
    </div>
  );
}