// src/App.jsx
import ChatWindow from './components/chatwindow';
import ClaimVerification from './components/claimverification';
import OfferReward from './components/offerReward';
import RewardsStatus from './components/RewardsStatus';

function App() {
  return (
    <>
   
      <OfferReward />
      <ClaimVerification />
  
      <ChatWindow />
      

    </>
  );
}

export default App;