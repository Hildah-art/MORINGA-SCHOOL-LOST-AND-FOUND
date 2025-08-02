import React, { useEffect, useState } from "react";
import axios from "axios";

function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const storedUser = JSON.parse(localStorage.getItem("user"));

      if (!storedUser || !storedUser.id) {
        setError("User not logged in or user data missing.");
        return;
      }

      axios
        .get(`http://localhost:5000/users/${storedUser.id}`)
        .then((res) => {
          setUser(res.data);
        })
        .catch((err) => {
          console.error("Profile fetch error:", err.response?.data || err.message);
          setError("Failed to load user profile.");
        });
    } catch (e) {
      console.error("Local storage parsing error:", e.message);
      setError("Could not read user data.");
    }
  }, []);

  if (error)
    return (
      <div style={{ textAlign: "center", color: "red", marginTop: "20px" }}>
        {error}
      </div>
    );

  if (!user)
    return (
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        Loading user profile...
      </div>
    );

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "40px auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "10px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f9f9f9",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>User Profile</h2>
      {user.profile_photo && (
        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <img
            src={user.profile_photo}
            alt="Profile"
            style={{
              width: "120px",
              height: "120px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        </div>
      )}
      <p>
        <strong>Full Name:</strong> {user.full_name}
      </p>
      <p>
        <strong>Email:</strong> {user.email}
      </p>
      <p>
        <strong>Phone:</strong> {user.phone}
      </p>
      <p>
        <strong>Role:</strong> {user.role}
      </p>
      {user.student_id && (
        <p>
          <strong>Student ID:</strong> {user.student_id}
        </p>
      )}
    </div>
  );
}

export default Profile;
