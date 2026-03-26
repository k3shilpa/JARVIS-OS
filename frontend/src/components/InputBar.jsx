import { useState, useRef, useEffect } from "react";
import "../styles/inputbar.css";

export default function InputBar({ onSend, isStreaming }) {
  const [text, setText] = useState("");
  const textareaRef = useRef(null);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 180) + "px";
  }, [text]);

  const handleSend = () => {
    if (!text.trim() || isStreaming) return;
    onSend(text.trim());
    setText("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="inputbar">
      <div className={`inputbar-inner ${isStreaming ? "streaming" : ""}`}>
        <textarea
          ref={textareaRef}
          className="inputbar-textarea"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask JARVIS anything… (Shift+Enter for newline)"
          rows={1}
          disabled={isStreaming}
        />
        <button
          className={`send-btn ${!text.trim() || isStreaming ? "disabled" : "active"}`}
          onClick={handleSend}
          disabled={!text.trim() || isStreaming}
          title="Send (Enter)"
        >
          {isStreaming ? (
            <div className="send-spinner" />
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          )}
        </button>
      </div>
      <p className="inputbar-hint">
        {isStreaming ? "JARVIS is thinking…" : "Enter to send · Shift+Enter for new line"}
      </p>
    </div>
  );
}