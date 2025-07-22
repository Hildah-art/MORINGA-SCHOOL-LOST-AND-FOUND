// src/App.jsx
import { BrowserRouter as Router } from 'react-router-dom';
import ChatWindow from './components/chatwindow';
import ClaimVerification from './components/claimverification';
import LoginForm from './components/LoginForm';
import NavBar from './components/NavBar';
import OfferReward from './components/offerReward';
import ReportLostItem from './components/ReportLostItem';
import PostItem from './components/PostItem';
import ItemDiscovery from './components/ItemDiscovery';


function App() {
  return (
    <>
      
      <NavBar />
      <LoginForm />
      <ReportLostItem />
      <ClaimVerification />
      <OfferReward />
      <ChatWindow />
      <PostItem />
      <ItemDiscovery />
      
      
      
      
      
      
    </>
  );
}

export default App;
