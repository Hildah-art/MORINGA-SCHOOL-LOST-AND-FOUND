import "./NavBar.css";

const NavBar = () => {
  return (
    <header className="navbar">
      <nav className="navbar-container">
        <div className="logo">LOST & FOUND</div>
        <div className="nav-links">
          <button className="nav-btn">Home</button>
          <button className="nav-btn">Report lost item</button>
          <button className="nav-btn">Report found item</button>
          <button className="nav-btn">Profile</button>
        </div>
      </nav>
    </header>
  );
};

export default NavBar;
