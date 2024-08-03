import React, { useState, useEffect } from 'react';
import { Container, Typography, TextField, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, MenuItem, Select, InputLabel, Tabs, Tab, Box, AppBar, Toolbar } from '@mui/material';
import axios from 'axios';
import { fetchCategories, addCategory, fetchGstRates, addGstRate, addProduct } from '../services/adminService';

const AdminDashboard = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [gstRateCategory, setGstRateCategory] = useState('');
  const [gstRatePercentage, setGstRatePercentage] = useState('');
  const [gstRates, setGstRates] = useState([]);
  const [products, setProducts] = useState([]);
  const [productName, setProductName] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productRate, setProductRate] = useState('');
  const [tabIndex, setTabIndex] = useState(0);
  const [revenueData, setRevenueData] = useState({
    revenueThisMonth: 0,
    revenueThisYear: 0,
    totalRevenue: 0,
    totalRevenueThisDay:0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoriesData = await fetchCategories();
        setCategories(categoriesData);

        const gstRatesData = await fetchGstRates();
        setGstRates(gstRatesData);

        const productsData = await fetchProducts(); // Fetch products initially
        setProducts(productsData);

        // Fetch revenue data
        const revenueThisMonth = await axios.get('http://localhost:9091/api/summary/revenue-this-month');
        const revenueThisYear = await axios.get('http://localhost:9091/api/summary/revenue-this-year');
        const totalRevenue = await axios.get('http://localhost:9091/api/summary/total-revenue');
        const totalRevenueThisDay = await axios.get('http://localhost:9091/api/summary/revenue-today');

        setRevenueData({
          revenueThisMonth: revenueThisMonth.data,
          revenueThisYear: revenueThisYear.data,
          totalRevenue: totalRevenue.data,
          totalRevenueThisDay:totalRevenueThisDay.data
        });
      } catch (error) {
        console.error("Failed to fetch data", error);
      }
    };

    fetchData();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:9091/api/products/all');
      return response.data; // Return the products data
    } catch (error) {
      console.error("Failed to fetch products", error);
      return []; // Return an empty array on error
    }
  };

  const handleAddCategory = async () => {
    try {
      await addCategory(newCategory);
      setCategories([...categories, { id: new Date().getTime(), category: newCategory }]); // Update this to your data structure
      setNewCategory('');
    } catch (error) {
      console.error("Failed to add category", error);
    }
  };

  const handleAddGstRate = async () => {
    try {
      await addGstRate({ category: gstRateCategory, percentage: gstRatePercentage });
      setGstRates([...gstRates, { category: gstRateCategory, percentage: gstRatePercentage, id: new Date().getTime() }]); // Update this to your data structure
      setGstRateCategory('');
      setGstRatePercentage('');
    } catch (error) {
      console.error("Failed to add GST rate", error);
    }
  };

  const handleAddProduct = async () => {
    try {
      await addProduct({ name: productName, category: productCategory, rate: productRate });
      const updatedProducts = await fetchProducts(); // Fetch updated products
      setProducts(updatedProducts); // Update products state
      setProductName('');
      setProductCategory('');
      setProductRate('');
    } catch (error) {
      console.error("Failed to add product", error);
    }
  };

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  return (
    <Container>
      <AppBar position="static" sx={{ backgroundColor: '#f0f0f0' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, color: 'black' }}>
            Admin Dashboard
          </Typography>
          <Button sx={{ color: 'black' }}
            color="inherit"
            onClick={() => {
              localStorage.removeItem('adminUsername'); // Clear admin session
              window.location.href = '/admin/login'; // Redirect to login page
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Tabs value={tabIndex} onChange={handleTabChange} centered>
        <Tab label="Add Category" />
        <Tab label="Add GST Rate" />
        <Tab label="Add Product" />
        <Tab label="Categories List" />
        <Tab label="GST Rates List" />
        <Tab label="Products List" />
        <Tab label="Summary" />
      </Tabs>

      <TabPanel value={tabIndex} index={0}>
        <Typography variant="h6">Add New Category</Typography>
        <TextField
          label="Category Name"
          fullWidth
          margin="normal"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleAddCategory}>
          Add Category
        </Button>
      </TabPanel>

      <TabPanel value={tabIndex} index={1}>
        <Typography variant="h6" marginTop={4}>Add GST Rate</Typography>
        <InputLabel id="category-label">Category</InputLabel>
        <Select
          labelId="category-label"
          value={gstRateCategory}
          fullWidth
          onChange={(e) => setGstRateCategory(e.target.value)}
          margin="normal"
        >
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.category}>{category.category}</MenuItem>
          ))}
        </Select>
        <TextField
          label="GST Rate (%)"
          type="number"
          fullWidth
          margin="normal"
          value={gstRatePercentage}
          onChange={(e) => setGstRatePercentage(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleAddGstRate}>
          Add GST Rate
        </Button>
      </TabPanel>

      <TabPanel value={tabIndex} index={2}>
        <Typography variant="h6" marginTop={4}>Add Product</Typography>
        <TextField
          label="Product Name"
          fullWidth
          margin="normal"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
        />
        <InputLabel id="product-category-label">Category</InputLabel>
        <Select
          labelId="product-category-label"
          value={productCategory}
          fullWidth
          onChange={(e) => setProductCategory(e.target.value)}
        >
          {categories.map((category) => (
            <MenuItem key={category.id} value={category.category}>{category.category}</MenuItem>
          ))}
        </Select>
        <TextField
          label="Product Rate"
          type="number"
          fullWidth
          margin="normal"
          value={productRate}
          onChange={(e) => setProductRate(e.target.value)}
        />
        <Button variant="contained" color="primary" onClick={handleAddProduct}>
          Add Product
        </Button>
      </TabPanel>

      <TabPanel value={tabIndex} index={3}>
        <Typography variant="h6" marginTop={4}>Categories List</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Category</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell>{category.category}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={tabIndex} index={4}>
        <Typography variant="h6" marginTop={4}>GST Rates List</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Category</TableCell>
                <TableCell>GST Rate (%)</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {gstRates.map((rate) => (
                <TableRow key={rate.id}>
                  <TableCell>{rate.categoryName}</TableCell>
                  <TableCell>{rate.gstRate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={tabIndex} index={5}>
        <Typography variant="h6" marginTop={4}>Products List</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Rate</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>{product.name}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.price}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>

      <TabPanel value={tabIndex} index={6}>
        <Typography variant="h6" marginTop={4}>Summary</Typography>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Description</TableCell>
                <TableCell>Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
            <TableRow>
                <TableCell>Total Revenue This Day</TableCell>
                <TableCell>${revenueData.totalRevenueThisDay.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Total Revenue This Month</TableCell>
                <TableCell>${revenueData.revenueThisMonth.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Total Revenue This Year</TableCell>
                <TableCell>${revenueData.revenueThisYear.toFixed(2)}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Total Revenue</TableCell>
                <TableCell>${revenueData.totalRevenue.toFixed(2)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </TabPanel>
    </Container>
  );
};

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
};

export default AdminDashboard;
