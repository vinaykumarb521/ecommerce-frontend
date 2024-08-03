import React, { useState } from 'react';
import { Container, Typography, TextField, Button } from '@mui/material';
import { loginUser } from '../services/userService'; // Implement this in your service

const UserLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      const response = await loginUser({ username, password });
      if (response.status === 200) {
        localStorage.setItem('username', username);
        window.location.href = '/'; // Redirect to landing page
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error("Failed to login", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Login</Typography>
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

export default UserLogin;
