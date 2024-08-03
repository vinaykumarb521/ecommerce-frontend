import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardActions, IconButton, Box, Select, MenuItem, FormControl } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { fetchProducts } from '../services/productService'; // Implement this in your service
import { fetchCategories, fetchGstRates } from '../services/adminService'; // Implement these in your service
import { debounce } from 'lodash';

const LandingPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [gstRates, setGstRates] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const products = await fetchProducts();
        setProducts(products);
        setFilteredProducts(products);
        
        // Fetch categories
        const categories = await fetchCategories();
        setCategories(categories.map(cat => typeof cat === 'string' ? cat : cat.category));
        
        // Fetch GST rates
        const gstRates = await fetchGstRates();
        // Transform gstRates into an object for quick lookup
        const gstRateMap = gstRates.reduce((acc, { categoryName, gstRate }) => {
          acc[categoryName] = gstRate;
          return acc;
        }, {});
        setGstRates(gstRateMap);
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (categoryFilter) {
      setFilteredProducts(products.filter(product => product.category === categoryFilter));
    } else {
      setFilteredProducts(products);
    }
  }, [categoryFilter, products]);

  const handleQuantityChange = (productId, change) => {
    setProducts((prevProducts) => {
      const updatedProducts = [...prevProducts];
      const productIndex = updatedProducts.findIndex(p => p.id === productId);
      if (productIndex !== -1) {
        const product = updatedProducts[productIndex];
        const newQuantity = Math.max(0, (product.quantity || 0) + change);

        // Convert price to number
        const rate = typeof product.price === 'number' ? product.price : parseFloat(product.price.replace(/[^0-9.-]+/g, ""));

        // Apply GST rate
        const taxRate = gstRates[product.category] || 0; // Fetch GST rate from the map
        const taxAmount = rate * newQuantity * (taxRate / 100);
        const total = rate * newQuantity + taxAmount;

        updatedProducts[productIndex] = { ...product, quantity: newQuantity };

        // Update local storage
        const existingCart = JSON.parse(localStorage.getItem('cart')) || {};
        if (newQuantity > 0) {
          existingCart[productId] = {
            ...product,
            quantity: newQuantity,
            total: total.toFixed(2), // Save the total without $
            tax: taxAmount.toFixed(2) // Save tax amount without $
          };
        } else {
          delete existingCart[productId];
        }
        localStorage.setItem('cart', JSON.stringify(existingCart));
      }
      return updatedProducts;
    });
  };

  // Define the debounced function after the original function
  const debouncedHandleQuantityChange = debounce((productId, change) => {
    handleQuantityChange(productId, change);
  }, 300); // Adjust the delay as needed

  return (
    <Container>
      <Typography variant="h4" gutterBottom>All Products</Typography>
      
      <FormControl fullWidth margin="normal">
        <Select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          displayEmpty
        >
          <MenuItem value="">All Categories</MenuItem>
          {categories.map((category, index) => (
            <MenuItem key={index} value={category}>{category}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <Grid container spacing={3} marginTop={2}>
        {filteredProducts.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{product.name}</Typography>
                <Typography variant="body1">Category: {product.category}</Typography>
                <Typography variant="body1">Rate: {product.price}</Typography> {/* Removed $ */}
              </CardContent>
              <CardActions>
                <Box display="flex" alignItems="center" p={2}>
                  <IconButton 
                    onClick={() => debouncedHandleQuantityChange(product.id, -1)} 
                    disabled={!product.quantity}
                    sx={{ 
                      backgroundColor: 'action.hover',
                      '&:hover': {
                        backgroundColor: 'action.selected',
                      },
                      marginRight: 1
                    }}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <Typography variant="body2" marginX={1}>
                    {product.quantity || 0}
                  </Typography>
                  <IconButton 
                    onClick={() => debouncedHandleQuantityChange(product.id, 1)}
                    sx={{ 
                      backgroundColor: 'action.hover',
                      '&:hover': {
                        backgroundColor: 'action.selected',
                      }
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                </Box>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default LandingPage;
