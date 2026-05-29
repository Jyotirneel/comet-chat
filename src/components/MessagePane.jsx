import { useEffect, useRef, useState } from 'react';
import { useMessages } from '../hooks/useMessages';

export default function MessagePane({ me, receiverUID, receiverName }) {
  const { messages, sendMessage, loading, error } = useMessages(receiverUID);
  const [draft, setDraft]   = useState('');
  const bottomRef           = useRef(null);
  const myUID               = me.getUid();

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const text = draft.trim();
    if (!text) return;
    setDraft('');
    await sendMessage(text);
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="pane">
      {/* Header */}
      <header className="pane-header">
        <div className="pane-avatar">{receiverName[0].toUpperCase()}</div>
        <div className="pane-title">
          <span className="pane-name">{receiverName}</span>
          <span className="pane-uid">{receiverUID}</span>
        </div>
      </header>

      {/* Messages */}
      <div className="messages-scroll">
        {loading && <div className="msg-state">Loading messages…</div>}
        {error   && <div className="msg-state error">{error}</div>}

        {!loading && messages.length === 0 && (
          <div className="msg-state">
            No messages yet — say hello 👋
          </div>
        )}

        {messages.map((msg) => {
          const isMine = msg.getSender().getUid() === myUID;
          const text   = msg.getText?.() || '';
          const ts     = formatTime(msg.getSentAt() * 1000);

          return (
            <div
              key={msg.getId()}
              className={`bubble-wrap ${isMine ? 'mine' : 'theirs'}`}
            >
              {!isMine && (
                <span className="bubble-sender">
                  {msg.getSender().getName() || msg.getSender().getUid()}
                </span>
              )}
              <div className="bubble">
                <span className="bubble-text">{text}</span>
                <span className="bubble-ts">{ts}</span>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Composer */}
      <footer className="composer">
        <textarea
          className="composer-input"
          rows={1}
          placeholder={`Message ${receiverName}…`}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKey}
        />
        <button
          className="composer-send"
          onClick={handleSend}
          disabled={!draft.trim()}
          aria-label="Send"
        >
          ↑
        </button>
      </footer>
    </div>
  );
}

function formatTime(ms) {
  if (!ms) return '';
  const d = new Date(ms);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}