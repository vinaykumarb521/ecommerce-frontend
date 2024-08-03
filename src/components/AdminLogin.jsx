import React, { useState } from 'react';
import { Container, Typography, TextField, Button } from '@mui/material';
import { adminLogin } from '../services/adminService'; // Implement this in your service

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await adminLogin({ username, password });
      if (response.status === 202) {
        localStorage.setItem('adminUsername', username);
        window.location.href = '/admin/dashboard'; // Redirect to dashboard
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error("Failed to login", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Admin Login</Typography>
      <TextField
        label="Username"
        fullWidth
        margin="normal"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        label="Password"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={handleLogin}>
        Login
      </Button>
    </Container>
  );
};

export default AdminLogin;
