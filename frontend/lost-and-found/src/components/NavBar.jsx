import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <header className="navbar">
      <nav className="navbar-container">
        <Link to="/" className="logo">MORINGA LOST & FOUND</Link>
        <div className="nav-links">
          <Link to="/" className="nav-btn">Home</Link>
          <Link to="/report-lost-item" className="nav-btn">Report Lost Item</Link>
          <Link to="/post-item" className="nav-btn">Report Found Item</Link>
          <Link to="/login" className="nav-btn">Profile</Link>
          {/* If you add a /profile route later, replace /login above with /profile */}
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
