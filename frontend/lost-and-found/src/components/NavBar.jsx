import { Link } from 'react-router-dom';

const NavBar = () => {
  const isLoggedIn = !!localStorage.getItem("user");

  return (
    <header className="navbar">
      <nav className="navbar-container">
        <Link to="/" className="logo">MORINGA LOST & FOUND</Link>
        <div className="nav-links">
          <Link to="/" className="nav-btn">Home</Link>
          <Link to="/report-lost-item" className="nav-btn">Report Lost Item</Link>
          <Link to="/post-item" className="nav-btn">Report Found Item</Link>

          {isLoggedIn && (
            <>
              <Link to="/profile" className="nav-btn">Profile</Link>
              <button
                className="nav-btn"
                onClick={() => {
                  localStorage.clear();
                  window.location.href = "/login";
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
