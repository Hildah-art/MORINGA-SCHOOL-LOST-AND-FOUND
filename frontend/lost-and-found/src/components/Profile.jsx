import React, { useEffect, useState } from "react";
import axios from "axios";

function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (!storedUser || !storedUser.id) {
      setError("User not logged in.");
      return;
    }

    axios.get(`http://localhost:5000/users/${storedUser.id}`)
      .then(res => setUser(res.data))
      .catch(err => setError("Failed to load user profile."));
  }, []);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!user) return <p>Loading...</p>;

  return (
    <div className="profile-container">
      <h2>User Profile</h2>
      {user.profile_photo && (
        <img
          src={user.profile_photo}
          alt="Profile"
          style={{ width: 100, height: 100, borderRadius: "50%" }}
        />
      )}
      <p><strong>Full Name:</strong> {user.full_name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Phone:</strong> {user.phone}</p>
      <p><strong>Role:</strong> {user.role}</p>
      {user.student_id && <p><strong>Student ID:</strong> {user.student_id}</p>}
    </div>
  );
}

export default Profile;
