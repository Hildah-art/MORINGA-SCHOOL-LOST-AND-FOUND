import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  CircularProgress,
  Avatar,
  Grid,
} from "@mui/material";
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

  if (error)
    return (
      <Typography color="error" textAlign="center" mt={4}>
        {error}
      </Typography>
    );

  if (!profile)
    return (
      <Box mt={5} display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );

  return (
    <Box maxWidth={600} mx="auto" mt={5}>
      <Paper elevation={4} sx={{ p: 4 }}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
          <Avatar
            src={profile.profile_photo}
            alt={profile.full_name}
            sx={{ width: 100, height: 100, mb: 2 }}
          />
          <Typography variant="h5" fontWeight="bold">
            {profile.full_name}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {profile.role}
          </Typography>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography color="text.secondary">Email</Typography>
            <Typography>{profile.email}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography color="text.secondary">Phone</Typography>
            <Typography>{profile.phone || "—"}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography color="text.secondary">Student/Staff ID</Typography>
            <Typography>{profile.student_staff_id}</Typography>
          </Grid>
          <Grid item xs={6}>
            <Typography color="text.secondary">Status</Typography>
            <Typography color={profile.active ? "success.main" : "error.main"}>
              {profile.active ? "Active" : "Inactive"}
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ProfilePage;
