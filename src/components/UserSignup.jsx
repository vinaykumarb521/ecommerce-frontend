import React, { useState } from 'react';
import { Container, Typography, TextField, Button } from '@mui/material';
import { registerUser } from '../services/userService'; // Implement this in your service

const UserSignup = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    try {
      await registerUser({ username, password });
      alert('User registered successfully!');
      window.location.href = '/user/login'; // Redirect to login page
    } catch (error) {
      console.error("Failed to register", error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Sign Up</Typography>
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
      <Button variant="contained" color="primary" onClick={handleSignup}>
        Sign Up
      </Button>
    </Container>
  );
};

export default UserSignup;
