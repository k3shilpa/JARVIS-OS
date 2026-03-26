import "../styles/quickcommands.css";

const COMMANDS = [
  {
    label: "Debug",
    icon: "🐛",
    prompt: "Debug this code and explain what's wrong:",
  },
  {
    label: "Refactor",
    icon: "♻️",
    prompt: "Refactor this code to be cleaner and more readable:",
  },
  {
    label: "Write Tests",
    icon: "🧪",
    prompt: "Write unit tests for this function:",
  },
  {
    label: "Explain",
    icon: "📖",
    prompt: "Explain how closures work in JavaScript with examples",
  },
];

export default function QuickCommands({ onSelect, compact = false }) {
  return (
    <div className={`quick-commands ${compact ? "compact" : ""}`}>
      {COMMANDS.map((cmd) => (
        <button
          key={cmd.label}
          className="qc-btn"
          onClick={() => onSelect(cmd.prompt)}
        >
          <span className="qc-icon">{cmd.icon}</span>
          <span className="qc-label">{cmd.label}</span>
        </button>
      ))}
    </div>
  );
}