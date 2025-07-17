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
