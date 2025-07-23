import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';


const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="sidebar-container">
      <button onClick={toggleSidebar} className="toggle-button">
        ☰ Menu
      </button>

      {isOpen && (
        <div className="sidebar">
          {/* Admin Routes */}
          <NavLink to="/" className={({ isActive }) => isActive ? "active" : ""}>Dashboard</NavLink>
          <NavLink to="/approve-items" className={({ isActive }) => isActive ? "active" : ""}>Approve Items</NavLink>
          <NavLink to="/add-items" className={({ isActive }) => isActive ? "active" : ""}>Add Items</NavLink>
          <NavLink to="/manage-users" className={({ isActive }) => isActive ? "active" : ""}>Manage Users</NavLink>
          <NavLink to="/payment-history" className={({ isActive }) => isActive ? "active" : ""}>Payment History</NavLink>
          <NavLink to="/resolve-disputes" className={({ isActive }) => isActive ? "active" : ""}>Resolve Disputes</NavLink>
          <NavLink to="/notifications" className={({ isActive }) => isActive ? "active" : ""}>Notifications</NavLink>
          <NavLink to="/reports" className={({ isActive }) => isActive ? "active" : ""}>Reports</NavLink>

          {/* Lost & Found Routes */}
          <NavLink to="/chat" className={({ isActive }) => isActive ? "active" : ""}>Chat Window</NavLink>
          <NavLink to="/offer-reward" className={({ isActive }) => isActive ? "active" : ""}>Offer Reward</NavLink>
          <NavLink to="/report-lost-item" className={({ isActive }) => isActive ? "active" : ""}>Report Lost Item</NavLink>
          <NavLink to="/claim-verification" className={({ isActive }) => isActive ? "active" : ""}>Claim Verification</NavLink>
          <NavLink to="/post-item" className={({ isActive }) => isActive ? "active" : ""}>Post Item</NavLink>
          <NavLink to="/discover-items" className={({ isActive }) => isActive ? "active" : ""}>Discover Items</NavLink>
          <NavLink to="/login" className={({ isActive }) => isActive ? "active" : ""}>Login</NavLink>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
