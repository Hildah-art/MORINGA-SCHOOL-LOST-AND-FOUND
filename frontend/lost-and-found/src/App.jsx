import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ChatWindow from './components/chatwindow';
import ClaimVerification from './components/claimverification';
import LoginForm from './components/LoginForm';
import NavBar from './components/NavBar';
import OfferReward from './components/offerReward';
import ReportLostItem from './components/ReportLostItem';
import FoundItem from './components/FoundItem';
import ItemDiscovery from './components/ItemDiscovery';

function App() {
  return (
    <Router>
      <NavBar />

      <header className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold text-center text-[#2E4734] mb-6">Lost & Found Platform</h1>
        <p className="text-[#D1D5DB]">Helping reunite items with their owners</p>

        {/* Navigation Links */}
        <nav className="mt-4 space-x-4">
          <Link to="/found" className="text-[#E46D2F] hover:text-[#2E4734] underline transition">
            Report Found Item
          </Link>
          <Link to="/discovery" className="text-[#E46D2F] hover:text-[#2E4734] underline transition">
            Discover Items
          </Link>
        </nav>
      </header>

      <Routes>
        <Route path="/found" element={
          <section className="bg-[#F7F7F7] shadow-lg rounded-2xl p-6 max-w-3xl mx-auto">
            <FoundItem />
            <OfferReward />
            <ClaimVerification />
          </section>
        } />

        <Route path="/discovery" element={
          <section className="bg-[#F7F7F7] shadow-lg rounded-2xl p-6 max-w-6xl mx-auto">
            <ItemDiscovery />
            <ChatWindow />
          </section>
        } />

        <Route path="/" element={
          <section className="max-w-xl mx-auto p-4">
            <LoginForm />
            <ReportLostItem />
          </section>
        } />
      </Routes>
    </Router>
  );
}

export default App;
