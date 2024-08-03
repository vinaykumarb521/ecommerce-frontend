import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Button, Typography } from '@mui/material';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" style={{ flexGrow: 1 }}>
          E-Commerce
        </Typography>
        <Button color="inherit" component={Link} to="/">Products</Button>
        <Button color="inherit" component={Link} to="/cart">Go to Cart</Button>
        <Button color="inherit" component={Link} to="/user/login">Sign In</Button>
        <Button color="inherit" component={Link} to="/admin/login">Sign In as Admin</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
