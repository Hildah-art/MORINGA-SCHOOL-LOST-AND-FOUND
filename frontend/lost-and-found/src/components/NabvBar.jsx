import { Link } from 'react-router-dom';
import './NavBar.css';

const NavBar = () => {
  return (
    <header className="navbar">
      <nav className="navbar-container">
        <Link to="/" className="logo">LOST & FOUND</Link>
        <div className="nav-links">
          <Link to="/" className="nav-btn">Home</Link>
          <Link to="/report-lost" className="nav-btn">Report lost item</Link>
          <Link to="/report-found" className="nav-btn">Report found item</Link>
          <Link to="/profile" className="nav-btn">Profile</Link>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
