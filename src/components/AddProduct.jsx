import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, MenuItem, Paper } from '@mui/material';
import { fetchCategories, addProduct } from '../services/adminService'; // Implement these in your service

const AddProduct = () => {
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categories = await fetchCategories();
        setCategories(categories);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };

    fetchData();
  }, []);

  const handleAddProduct = async () => {
    try {
      await addProduct({ name: productName, price, category: selectedCategory });
      setProductName('');
      setPrice('');
      setSelectedCategory('');
    } catch (error) {
      console.error("Failed to add product", error);
    }
  };

  return (
    <Container component={Paper} style={{ padding: 20, marginTop: 20 }}>
      <Typography variant="h4" gutterBottom>Add New Product</Typography>
      <TextField
        label="Product Name"
        fullWidth
        margin="normal"
        value={productName}
        onChange={(e) => setProductName(e.target.value)}
      />
      <TextField
        label="Price"
        type="number"
        fullWidth
        margin="normal"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <TextField
        label="Category"
        select
        fullWidth
        margin="normal"
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        {categories.map((category, index) => (
          <MenuItem key={index} value={category}>
            {category}
          </MenuItem>
        ))}
      </TextField>
      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleAddProduct}
        style={{ marginTop: 20 }}
      >
        Add Product
      </Button>
    </Container>
  );
};

export default AddProduct;
