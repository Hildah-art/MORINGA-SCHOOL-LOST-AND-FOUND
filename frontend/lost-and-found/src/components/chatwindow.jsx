import { useState } from 'react';

function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [role, setRole] = useState('Loser');
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
