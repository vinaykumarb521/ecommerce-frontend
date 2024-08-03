import React, { useState, useEffect } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { createBill } from '../services/billService'; // Ensure this is implemented

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [buyerName, setBuyerName] = useState(''); // Set this based on your login system

  useEffect(() => {
    const fetchCartItems = () => {
      const storedCart = JSON.parse(localStorage.getItem('cart')) || {};
      const items = Object.values(storedCart);
      setCartItems(items);

      // Calculate total amount
      const total = items.reduce((acc, item) => 
        acc + (item.price * item.quantity * (1 + item.tax / 100)), 0);
      setTotalAmount(total.toFixed(2));
    };

    fetchCartItems();
  }, []);

  const handleCheckout = async () => {
    if (!buyerName) {
      alert("Please enter your name before proceeding.");
      return;
    }

    try {
      const billData = createBillData(cartItems, buyerName);
      await createBill(billData);
      localStorage.removeItem('cart'); // Clear cart after checkout
      alert("Checkout successful!");
      setCartItems([]);
      setTotalAmount(0);
    } catch (error) {
      console.error("Failed to create bill", error);
      alert("Checkout failed. Please try again.");
    }
  };

  // Utility function to create the bill data object
  const createBillData = (cartItems, buyerName) => {
    const billItems = cartItems.map(item => ({
      productName: item.name, // Field name matches the backend
      category: item.category,
      price: item.price,
      quantity: item.quantity,
      tax: item.tax,
      total: (item.price * item.quantity * (1 + item.tax / 100)).toFixed(2) // Total calculation
    }));

    return {
      date: new Date().toISOString().split('T')[0], // Current date
      amount: cartItems.reduce((acc, item) => 
        acc + (item.price * item.quantity * (1 + item.tax / 100)), 
        0
      ).toFixed(2),
      buyerName,
      items: billItems
    };
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Your Cart</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Rate</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Tax</TableCell>
              <TableCell>Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {cartItems.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.price}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.tax}%</TableCell>
                <TableCell>{(item.price * item.quantity * (1 + item.tax / 100)).toFixed(2)}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={5} align="right"><strong>Total Amount</strong></TableCell>
              <TableCell><strong>{totalAmount}</strong></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <Typography variant="h6" gutterBottom style={{ marginTop: 20 }}>
        Enter Your Name
      </Typography>
      <input
        type="text"
        value={buyerName}
        onChange={(e) => setBuyerName(e.target.value)}
        placeholder="Your name"
        style={{ marginBottom: 20, padding: 10, width: '100%', fontSize: 16 }}
      />
      <Button
        variant="contained"
        color="primary"
        style={{ marginTop: 20 }}
        onClick={handleCheckout}
      >
        Checkout
      </Button>
    </Container>
  );
};

export default Cart;
