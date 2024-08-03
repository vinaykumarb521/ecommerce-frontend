import React, { useState, useEffect } from 'react';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button } from '@mui/material';
import { fetchSalesSummary } from '../services/adminService'; // Implement this in your service

const SummaryPage = () => {
  const [summary, setSummary] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const summaryData = await fetchSalesSummary();
        setSummary(summaryData);
      } catch (error) {
        console.error("Failed to fetch summary", error);
      }
    };

    fetchData();
  }, []);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>Sales Summary</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>Total Sales</TableCell>
              <TableCell>Revenue</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {summary.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.date}</TableCell>
                <TableCell>${item.totalSales}</TableCell>
                <TableCell>${item.revenue}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default SummaryPage;
