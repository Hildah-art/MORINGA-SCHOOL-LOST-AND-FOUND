// src/App.jsx
import { BrowserRouter as Router } from 'react-router-dom';
import ChatWindow from './components/chatwindow';
import ClaimVerification from './components/claimverification';
import LoginForm from './components/LoginForm';
import NavBar from './components/NavBar';
import OfferReward from './components/offerReward';
import ReportLostItem from './components/ReportLostItem';


function App() {
  return (
    <>
      
      <NavBar />
      <LoginForm />
      <ReportLostItem />
      <OfferReward />
      <ClaimVerification />
      <ChatWindow />
      
      
      
    </>
  );
}

export default App;
