import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, CircularProgress } from "@mui/material";
import { api } from "../api/api";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await api.getProfile();
        setProfile(res);
      } catch (err) {
        console.error(err);
        setError("Could not fetch profile.");
      }
    };
    loadProfile();
  }, []);

  if (error) return <Typography color="error">{error}</Typography>;
  if (!profile) return <CircularProgress />;

  return (
    <Box maxWidth={500} mx="auto" mt={5}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" mb={2}>
          My Profile
        </Typography>
        <Typography>
          <strong>Full Name:</strong> {profile.full_name}
        </Typography>
        <Typography>
          <strong>Email:</strong> {profile.email}
        </Typography>
        <Typography>
          <strong>Phone:</strong> {profile.phone}
        </Typography>
        <Typography>
          <strong>Role:</strong> {profile.role}
        </Typography>
        <Typography>
          <strong>ID:</strong> {profile.student_staff_id}
        </Typography>
      </Paper>
    </Box>
  );
};

export default ProfilePage;
