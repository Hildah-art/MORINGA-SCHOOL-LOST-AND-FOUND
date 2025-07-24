import React from 'react';
import { useNavigate } from 'react-router-dom';


const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="hero-container">
      <div className="hero-content">
        <h1>Find What’s Lost. Return What’s Found.</h1>
        <p>Your community-powered solution to reuniting lost items and their owners.</p>
        <div className="hero-buttons">
          <button onClick={() => navigate('/signup')}>Sign Up</button>
          <button onClick={() => navigate('/login')}>Log In</button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
