import { useState } from "react";
import "../styles/messagebubble.css";

// Simple markdown renderer: handles **bold**, `inline code`, and ```code blocks```
function renderContent(content) {
  const parts = [];
  // Split by fenced code blocks first
  const codeBlockRegex = /```(\w*)\n?([\s\S]*?)```/g;
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    // Text before this code block
    if (match.index > lastIndex) {
      parts.push({ type: "text", value: content.slice(lastIndex, match.index) });
    }
    parts.push({ type: "code", lang: match[1] || "js", value: match[2].trimEnd() });
    lastIndex = match.index + match[0].length;
  }

  // Remaining text
  if (lastIndex < content.length) {
    parts.push({ type: "text", value: content.slice(lastIndex) });
  }

  return parts;
}

function InlineText({ text }) {
  // Handle **bold** and `inline code`
  const segments = text.split(/(\*\*.*?\*\*|`[^`]+`)/g);
  return (
    <>
      {segments.map((seg, i) => {
        if (seg.startsWith("**") && seg.endsWith("**")) {
          return <strong key={i}>{seg.slice(2, -2)}</strong>;
        }
        if (seg.startsWith("`") && seg.endsWith("`")) {
          return <code key={i} className="inline-code">{seg.slice(1, -1)}</code>;
        }
        // Handle line breaks
        return seg.split("\n").map((line, j, arr) => (
          <span key={`${i}-${j}`}>
            {line}
            {j < arr.length - 1 && <br />}
          </span>
        ));
      })}
    </>
  );
}

function CodeBlock({ lang, value }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-block">
      <div className="code-header">
        <span className="code-lang">{lang || "code"}</span>
        <button className="copy-btn" onClick={handleCopy}>
          {copied ? (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Copied!
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
      <pre className="code-body">
        <code>{value}</code>
      </pre>
    </div>
  );
}

export default function MessageBubble({ message, isStreaming }) {
  const parts = renderContent(message.content);
  const isUser = message.role === "user";

  return (
    <div className={`bubble-wrap ${isUser ? "user" : "assistant"}`}>
      <div className="bubble-avatar">
        {isUser ? (
          <div className="avatar-user">U</div>
        ) : (
          <div className="avatar-jarvis">
            <div className="av-arc av1" />
            <div className="av-arc av2" />
            <span className="av-j">J</span>
          </div>
        )}
      </div>

      <div className={`bubble-content ${isUser ? "bubble-user" : "bubble-assistant"}`}>
        {parts.map((part, i) =>
          part.type === "code" ? (
            <CodeBlock key={i} lang={part.lang} value={part.value} />
          ) : (
            <p key={i} className="bubble-text">
              <InlineText text={part.value} />
            </p>
          )
        )}

        {isStreaming && (
          <span className="cursor-blink">▋</span>
        )}
      </div>
    </div>
  );
}