import { useState, useEffect, useCallback, useRef } from 'react';
import { CometChat } from '../cometchat';

const LISTENER_ID = 'msg-listener-' + Date.now();

/**
 * Custom hook that manages messages for a 1-to-1 conversation.
 *
 * @param {string|null} receiverUID  — UID of the other user, or null if no chat selected
 * @returns {{ messages, sendMessage, loading, error }}
 */
export function useMessages(receiverUID) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const receiverRef = useRef(receiverUID);

  // Keep ref current so the listener closure always sees the latest selected peer
  useEffect(() => { receiverRef.current = receiverUID; }, [receiverUID]);

  // ── Fetch message history when the selected user changes ─────────────────
  useEffect(() => {
    if (!receiverUID) { setMessages([]); return; }

    let cancelled = false;
    setLoading(true);
    setError(null);

    const request = new CometChat.MessagesRequestBuilder()
      .setUID(receiverUID)
      .setLimit(50)
      .build();

    request.fetchPrevious().then((msgs) => {
      if (!cancelled) {
        setMessages(msgs.filter(m => m.getCategory() === 'message'));
        setLoading(false);
      }
    }).catch((err) => {
      if (!cancelled) {
        setError(err.message || 'Failed to fetch messages');
        setLoading(false);
      }
    });

    return () => { cancelled = true; };
  }, [receiverUID]);

  // ── Real-time listener ────────────────────────────────────────────────────
  useEffect(() => {
    CometChat.addMessageListener(
      LISTENER_ID,
      new CometChat.MessageListener({
        onTextMessageReceived(msg) {
          const sender = msg.getSender().getUid();
          // Only append if the message belongs to the active conversation
          if (sender === receiverRef.current || msg.getReceiverId() === receiverRef.current) {
            setMessages(prev => [...prev, msg]);
          }
        },
        onMessageEdited(msg) {
          setMessages(prev =>
            prev.map(m => m.getId() === msg.getId() ? msg : m)
          );
        },
        onMessageDeleted(msg) {
          setMessages(prev => prev.filter(m => m.getId() !== msg.getId()));
        }
      })
    );

    return () => CometChat.removeMessageListener(LISTENER_ID);
  }, []);

  // ── Send a message ────────────────────────────────────────────────────────
  const sendMessage = useCallback(async (text) => {
    if (!receiverUID || !text.trim()) return;

    const textMsg = new CometChat.TextMessage(
      receiverUID,
      text.trim(),
      CometChat.RECEIVER_TYPE.USER
    );

    try {
      const sent = await CometChat.sendMessage(textMsg);
      setMessages(prev => [...prev, sent]);
    } catch (err) {
      setError(err.message || 'Failed to send message');
    }
  }, [receiverUID]);

  return { messages, sendMessage, loading, error };
}