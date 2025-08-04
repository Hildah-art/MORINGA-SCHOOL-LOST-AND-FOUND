import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/login", { email, password });

      console.log("Server response:", res.data);

      if (res.data && res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/profile"); 
      } else {
        alert("Login response malformed.");
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      alert("Invalid credentials. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
