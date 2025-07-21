import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import NavBar from './components/NabvBar';
import LoginForm from './components/LoginForm';
//import Home from './components/Home';
//import ReportLost from './components/ReportLost';
//import ReportFound from './components/ReportFound';
//import Profile from './components/Profile';

const App = () => {
  return (
    <Router>
      <NavBar />
      <Routes>

        <Route path="/" element={<LoginForm />} />


      </Routes>
    </Router>
  );
};

export default App;
