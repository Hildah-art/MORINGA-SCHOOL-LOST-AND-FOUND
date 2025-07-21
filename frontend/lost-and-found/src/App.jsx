import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import FoundItem from "./components/FoundItem";
import ItemDiscovery from "./components/ItemDiscovery";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#FFFFFF] px-4 py-8">
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
            </section>
          } />

          <Route path="/discovery" element={
            <section className="bg-[#F7F7F7] shadow-lg rounded-2xl p-6 max-w-6xl mx-auto">
              <ItemDiscovery />
            </section>
          } />

          <Route path="/" element={<FoundItem />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
