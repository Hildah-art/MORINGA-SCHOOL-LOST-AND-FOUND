import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Switch,
  Badge,
  IconButton,
  Divider
} from '@mui/material';
import { 
  Notifications as NotificationsIcon,
  Email,
  Sms,
  CircleNotifications
} from '@mui/icons-material';
import { useSnackbar } from 'notistack';

const Notifications = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, message: 'New item reported in lost & found', read: false, timestamp: '2023-05-20T10:30:00' },
    { id: 2, message: 'Your dispute has been resolved', read: true, timestamp: '2023-05-19T14:15:00' }
  ]);
  
  const [preferences, setPreferences] = useState({
    pushEnabled: true,
    emailEnabled: false,
    smsEnabled: false
  });
  
  const { enqueueSnackbar } = useSnackbar();

  // Simulate real-time notifications with WebSocket
  useEffect(() => {
    const ws = new WebSocket('wss://your-websocket-endpoint');
    
    ws.onmessage = (event) => {
      const newNotification = {
        id: Date.now(),
        message: event.data,
        read: false,
        timestamp: new Date().toISOString()
      };
      
      setNotifications(prev => [newNotification, ...prev]);
      
      if (preferences.pushEnabled) {
        enqueueSnackbar(event.data, { 
          variant: 'info',
          autoHideDuration: 3000,
          action: (
            <IconButton color="inherit" size="small">
              <CircleNotifications />
            </IconButton>
          )
        });
      }
    };
    
    return () => ws.close();
  }, [preferences.pushEnabled, enqueueSnackbar]);

  const togglePreference = (type) => {
    setPreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        <NotificationsIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
        Notifications
      </Typography>
      
      <Box sx={{ mb: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>Notification Preferences</Typography>
        <List>
          <ListItem>
            <ListItemIcon>
              <CircleNotifications />
            </ListItemIcon>
            <ListItemText primary="Push Notifications" />
            <Switch 
              checked={preferences.pushEnabled}
              onChange={() => togglePreference('pushEnabled')}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Email />
            </ListItemIcon>
            <ListItemText primary="Email Notifications" />
            <Switch 
              checked={preferences.emailEnabled}
              onChange={() => togglePreference('emailEnabled')}
            />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <Sms />
            </ListItemIcon>
            <ListItemText primary="SMS Notifications" />
            <Switch 
              checked={preferences.smsEnabled}
              onChange={() => togglePreference('smsEnabled')}
            />
          </ListItem>
        </List>
      </Box>
      
      <Box sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
        <Typography variant="h6" sx={{ p: 2 }}>Recent Notifications</Typography>
        <Divider />
        <List>
          {notifications.map((notification) => (
            <ListItem 
              key={notification.id} 
              button 
              onClick={() => markAsRead(notification.id)}
              sx={{
                bgcolor: notification.read ? 'inherit' : 'action.hover'
              }}
            >
              <ListItemIcon>
                <Badge color="error" variant="dot" invisible={notification.read}>
                  <NotificationsIcon />
                </Badge>
              </ListItemIcon>
              <ListItemText
                primary={notification.message}
                secondary={new Date(notification.timestamp).toLocaleString()}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default Notifications;