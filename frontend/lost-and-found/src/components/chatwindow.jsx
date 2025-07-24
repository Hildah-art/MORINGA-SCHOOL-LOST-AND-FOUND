import { useState } from 'react';

function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [role, setRole] = useState('Loser');
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const handleSend = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const newMessage = {
      id: Date.now(),
      role,
      text,
      file: file ? URL.createObjectURL(file) : null,
    };

    setMessages([...messages, newMessage]);
    setText('');
    setFile(null);
  };

    return (
    <div className="chat-window">
      <h2> In-App Chat (Loser vs Finder)</h2>

      <form onSubmit={handleSend}>
        <label>
          I am the:
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="Loser">Loser</option>
            <option value="Finder">Finder</option>
          </select>
        </label>

        <textarea
          placeholder="Type your message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button type="submit">Send</button>
      </form>

      <div className="chat-history">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat-bubble ${msg.role === 'Loser' ? 'loser' : 'finder'}`}
          >
            <strong>{msg.role}:</strong>
            <p>{msg.text}</p>
            {msg.file && <img src={msg.file} alt="attachment" />}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChatWindow;
