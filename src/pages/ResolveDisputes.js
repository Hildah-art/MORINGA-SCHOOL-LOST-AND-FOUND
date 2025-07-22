import React, { useState } from 'react';
import { Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField, Button, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { ExpandMore, Search, Check, Close } from '@mui/icons-material';

const ResolveDisputes = () => {
  const [disputes, setDisputes] = useState([
    { 
      id: 1, 
      user: 'John Doe', 
      item: 'Wallet', 
      date: '2023-05-10', 
      status: 'open', 
      description: 'I believe this is my wallet but the finder is not responding to my messages.',
      resolution: ''
    },
    { 
      id: 2, 
      user: 'Jane Smith', 
      item: 'Phone', 
      date: '2023-05-12', 
      status: 'in progress', 
      description: 'The phone description matches mine but the finder is asking for an unreasonable reward.',
      resolution: 'Contacted both parties to negotiate a fair reward.'
    },
    { 
      id: 3, 
      user: 'Bob Johnson', 
      item: 'Keys', 
      date: '2023-05-15', 
      status: 'resolved', 
      description: 'Dispute over ownership of the keys.',
      resolution: 'Verified ownership through security footage. Keys returned to rightful owner.'
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [activeDispute, setActiveDispute] = useState(null);
  const [resolutionText, setResolutionText] = useState('');

  const filteredDisputes = disputes.filter(dispute => 
    dispute.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
    dispute.item.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleResolve = (id) => {
    setDisputes(disputes.map(dispute => 
      dispute.id === id ? { ...dispute, status: 'resolved', resolution: resolutionText } : dispute
    ));
    setActiveDispute(null);
    setResolutionText('');
  };

  const handleReject = (id) => {
    setDisputes(disputes.map(dispute => 
      dispute.id === id ? { ...dispute, status: 'rejected', resolution: 'Dispute rejected as invalid.' } : dispute
    ));
    setActiveDispute(null);
    setResolutionText('');
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>Resolve Disputes</Typography>
      
      <TextField
        label="Search Disputes"
        variant="outlined"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: <Search sx={{ mr: 1 }} />,
        }}
      />
      
      {filteredDisputes.map((dispute) => (
        <Accordion key={dispute.id} expanded={activeDispute === dispute.id} onChange={() => setActiveDispute(activeDispute === dispute.id ? null : dispute.id)}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}>
              <Typography>{dispute.item} - {dispute.user}</Typography>
              <Box 
                sx={{ 
                  display: 'inline-block', 
                  p: '4px 8px', 
                  borderRadius: 1,
                  backgroundColor: 
                    dispute.status === 'resolved' ? 'success.light' : 
                    dispute.status === 'rejected' ? 'error.light' : 
                    dispute.status === 'in progress' ? 'warning.light' : 'info.light',
                  color: 'common.white',
                }}
              >
                {dispute.status}
              </Box>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="subtitle1" gutterBottom>Dispute Details:</Typography>
            <Typography paragraph>{dispute.description}</Typography>
            
            {dispute.resolution && (
              <>
                <Typography variant="subtitle1" gutterBottom>Resolution:</Typography>
                <Typography paragraph>{dispute.resolution}</Typography>
              </>
            )}
            
            {dispute.status !== 'resolved' && dispute.status !== 'rejected' && (
              <>
                <TextField
                  label="Resolution Notes"
                  multiline
                  rows={4}
                  fullWidth
                  value={resolutionText}
                  onChange={(e) => setResolutionText(e.target.value)}
                  sx={{ mt: 2, mb: 2 }}
                />
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button 
                    variant="contained" 
                    color="success" 
                    startIcon={<Check />}
                    onClick={() => handleResolve(dispute.id)}
                  >
                    Mark as Resolved
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="error" 
                    startIcon={<Close />}
                    onClick={() => handleReject(dispute.id)}
                  >
                    Reject Dispute
                  </Button>
                </Box>
              </>
            )}
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};

export default ResolveDisputes;