import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import InputBar from "./InputBar";
import QuickCommands from "./QuickCommands";
import "../styles/chatwindow.css";

export default function ChatWindow({ messages, isStreaming, onSend }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const isEmpty = messages.length === 0;

  return (
    <div className="chat-window">
      <div className="messages-area">
        {isEmpty && (
          <div className="empty-state">
            <div className="empty-arcs">
              <div className="e-arc e1" />
              <div className="e-arc e2" />
              <div className="e-arc e3" />
              <span className="e-j">J</span>
            </div>
            <h2 className="empty-title">How can I help you build today?</h2>
            <p className="empty-sub">
              Ask me to debug, refactor, write tests, or explain any concept.
            </p>
            <QuickCommands onSelect={onSend} />
          </div>
        )}

        {!isEmpty && messages.map((msg, i) => (
          <MessageBubble
            key={msg.id}
            message={msg}
            isStreaming={isStreaming && i === messages.length - 1 && msg.role === "assistant"}
          />
        ))}

        <div ref={bottomRef} />
      </div>

      <div className="input-area">
        {!isEmpty && <QuickCommands onSelect={onSend} compact />}
        <InputBar onSend={onSend} isStreaming={isStreaming} />
      </div>
    </div>
  );
}