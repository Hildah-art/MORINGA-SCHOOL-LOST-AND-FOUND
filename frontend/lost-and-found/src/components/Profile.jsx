import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import './profile.css';
import axios from "axios";

function Profile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const defaultProfileImage = "https://ui-avatars.com/api/?name=User&background=0077b6&color=fff";

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:5000/users/${id}`)
      .then(res => {
        setUser(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError("Failed to load user profile.");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="profile-container"><p className="loading">Loading...</p></div>;
  if (error) return <div className="profile-container"><p className="error">{error}</p></div>;

  return (
    <div className="profile-container">
      <div className="profile-header">
        <img
          src={user.profile_photo || defaultProfileImage}
          alt="Profile"
          className="profile-photo"
        />
        <div className="profile-title">
          <h2>User Profile</h2>
        </div>
      </div>
      
      <div className="profile-details">
        <p><strong>Full Name</strong>{user.full_name}</p>
        <p><strong>Email</strong>{user.email}</p>
        <p><strong>Phone</strong>{user.phone}</p>
        <p><strong>Role</strong>{user.role}</p>
        {user.student_id && <p><strong>Student ID</strong>{user.student_id}</p>}
      </div>
    </div>
  );
}

export default Profile;