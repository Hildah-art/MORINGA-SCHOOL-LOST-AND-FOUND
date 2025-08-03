import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  Pagination,
  Avatar,
  Tab,
} from "@mui/material";
import { Check, Clear } from "@mui/icons-material";
import { api } from "../api/api";

const ApproveItems = () => {
  const [items, setItems] = useState([]);
  const [pageInfo, setPageInfo] = useState({ page: 1, pages: 1 });
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");

  const fetchItems = async (page = 1) => {
    try {
      const res = await api.getLostItems(page);
      setItems(res.items || []);
      setPageInfo({ page: res.page, pages: res.pages });
    } catch (err) {
      console.error(err);
      setError(`Failed to load items: ${err.message}`);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handlePageChange = (_, value) => {
    setPageInfo((prev) => ({ ...prev, page: value }));
    fetchItems(value);
  };

  const handleApprove = (id) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, status: "APPROVED" } : item
      )
    );
    // TODO: send to API
  };

  const handleReject = (id) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, status: "REJECTED" } : item
      )
    );
    // TODO: send to API
  };

  const filteredItems = items.filter(
    (item) =>
      item.status === "LOST" &&
      (item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getImageUrl = (filename) =>
    filename.startsWith("http")
      ? filename
      : `http://127.0.0.1:5000/uploads/${filename}`;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Approve Items
      </Typography>

      <TextField
        label="Search Items"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {error && <Typography color="error">{error}</Typography>}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Location</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Reported By</TableCell>
              <TableCell>Comments</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  {item.image ? (
                    <Avatar
                      src={getImageUrl(item.image)}
                      alt={item.title}
                      variant="rounded"
                      sx={{ width: 60, height: 60 }}
                    />
                  ) : (
                    "No Image"
                  )}
                </TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.last_seen_location}</TableCell>
                <TableCell>{item.date.split("T")[0]}</TableCell>
                <TableCell>
                  {item.user?.full_name || "Unknown"}
                  <br />
                  <small>{item.user?.email}</small>
                </TableCell>
                <TableCell>{item.comments?.length || 0} comment(s)</TableCell>
                <TableCell>
                  <Typography
                    color={item.status === "LOST" ? "error" : "success.main"}
                  >
                    {item.status}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="success"
                    startIcon={<Check />}
                    onClick={() => handleApprove(item.id)}
                    sx={{ mr: 1 }}
                  >
                    Approve
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    startIcon={<Clear />}
                    onClick={() => handleReject(item.id)}
                  >
                    Reject
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filteredItems.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No items pending approval.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {pageInfo.pages > 1 && (
        <Box mt={3} display="flex" justifyContent="center">
          <Pagination
            count={pageInfo.pages}
            page={pageInfo.page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
};

export default ApproveItems;
