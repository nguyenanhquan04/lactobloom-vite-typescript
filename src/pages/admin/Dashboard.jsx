import React, { useState, useEffect } from 'react';
import {
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  Box,
  IconButton
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar, 
  ResponsiveContainer
} from 'recharts';
import { Menu as MenuIcon } from '@mui/icons-material';
import axios from 'axios';
import Cookies from 'js-cookie';
import { getMonthRevenue, getSalesByDayOfMonth, getSalesByMonthOfYear, getTodayOrders, getTodayRevenue, getTop5RecentOrders, getTop5SellingProducts, getTotalRevenue } from '../../utils/DashboardService';
import { getAllProducts, getProductByProductId } from '../../utils/ProductService';
import { getShopMembers } from '../../utils/UserService';

const Dashboard = () => {
  const [topSellingProducts, setTopSellingProducts] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [monthRevenue, setMonthRevenue] = useState(0);
  const [salesByMonth, setSalesByMonth] = useState([]);
  const [salesByDate, setSalesByDate] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [numberOfProducts, setNumberOfProducts] = useState([]);
  const [numberOfMembers, setNumberOfMembers] = useState([]);
  const [numberOfTodayOrders, setNumberOfTodayOrders] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    fetchTopSellingProducts();
    fetchRecentOrders();
    fetchRevenueData();
    fetchSalesData();
    fetchNumberOfProducts();
    fetchNumberOfMembers();
    fetchNumberOfTodayOrders();
  }, []);

  useEffect(() => {
    fetchSalesByDate();
  }, [selectedMonth]);

  const fetchTopSellingProducts = async () => {
    const token = Cookies.get('authToken');
    try {
      const response = await getTop5SellingProducts(token);
      const products = response.data;
      
      const productDetailsPromises = products.map(async (product) => {
        const productResponse = await getProductByProductId(product.productId);
        return {
          productId: product.productId,
          totalMoney: product.totalMoney,
          productName: productResponse.data.productName
        };
      });

      const productDetails = await Promise.all(productDetailsPromises);
      setTopSellingProducts(productDetails);
    } catch (error) {
      console.error('Error fetching top selling products:', error);
    }
  };

  const fetchRecentOrders = async () => {
    const token = Cookies.get('authToken');
    try {
      const response = await getTop5RecentOrders(token);
      const orders = response.data.map(order => ({
        id: order.orderId,
        customer: order.fullName,
        date: order.orderDate.split('T')[0],
        total: order.totalPrice
      }));
      setRecentOrders(orders);
    } catch (error) {
      console.error('Error fetching recent orders:', error);
    }
  };

  const fetchRevenueData = async () => {
    const token = Cookies.get('authToken');
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
  
    try {
      const totalRevenueResponse = await getTotalRevenue(token);
      setTotalRevenue(parseFloat(totalRevenueResponse.data));
  
      const todayRevenueResponse = await getTodayRevenue(token);
      setTodayRevenue(parseFloat(todayRevenueResponse.data));
  
      const monthRevenueResponse = await getMonthRevenue(token, month, year);
      setMonthRevenue(parseFloat(monthRevenueResponse.data));
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    }
  };

  const fetchSalesData = async () => {
    const token = Cookies.get('authToken');
    try {
      const year = new Date().getFullYear();
      const response = await getSalesByMonthOfYear(token, year);
      const salesData = response.data.map(item => ({
        month: item.month,
        'Doanh Thu (Triệu)': parseFloat(item.revenue) / 1000000, // Adjust revenue scale here
        'Số Đơn Hàng': item.orderCounts
      }));
      setSalesByMonth(salesData);
    } catch (error) {
      console.error('Error fetching sales data:', error);
    }
  };

  const fetchNumberOfProducts = async () => {
    try {
      const response = await getAllProducts();
      setNumberOfProducts(response.data.length); 
    } catch (error) {
      console.error('Error fetching number of products:', error);
    }
  };

  const fetchNumberOfMembers = async () => {
    const token = Cookies.get('authToken');
    try {
      const response = await getShopMembers(token);
      setNumberOfMembers(response.data.length); 
    } catch (error) {
      console.error('Error fetching number of members:', error);
    }
  };

  const fetchNumberOfTodayOrders = async () => {
    const token = Cookies.get('authToken');
    try {
      const response = await getTodayOrders(token);
      setNumberOfTodayOrders(response.data.length);
    } catch (error) {
      console.error('Error fetching number of today orders:', error);
    }
  };
  const fetchSalesByDate = async () => {
    const token = Cookies.get('authToken');
    try {
      const year = new Date().getFullYear();
      const response = await getSalesByDayOfMonth(token, selectedMonth, year);
      const salesDateData = response.data.map(item => ({
        date: item.date,
        'Doanh Thu (Triệu)': parseFloat(item.revenue) / 1000000, // Adjust revenue scale here
        'Số Đơn Hàng': item.orderCounts
      }));
      setSalesByDate(salesDateData);
    } catch (error) {
      console.error('Error fetching sales by date:', error);
    }
  };

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <IconButton onClick={toggleDrawer} sx={{ display: { md: 'none' } }}>
          <MenuIcon />
        </IconButton>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4}>
            <Card sx={{ backgroundColor: '#f5f5f5', boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Tổng Doanh Thu
                </Typography>
                <Box display="flex" justifyContent="center" alignItems="center" height={150}>
                  <Typography variant="h4">
                    {totalRevenue.toLocaleString("vi-VN")} VND
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <Card sx={{ backgroundColor: '#f5f5f5', boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Doanh Thu Trong Ngày
                </Typography>
                <Box display="flex" justifyContent="center" alignItems="center" height={150}>
                  <Typography variant="h4">
                    {todayRevenue.toLocaleString("vi-VN")} VND
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <Card sx={{ backgroundColor: '#f5f5f5', boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Doanh Thu Trong Tháng
                </Typography>
                <Box display="flex" justifyContent="center" alignItems="center" height={150}>
                  <Typography variant="h4">
                    {monthRevenue.toLocaleString("vi-VN")} VND
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <Card sx={{ backgroundColor: '#f5f5f5', boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Tổng Sản Phẩm Shop
                </Typography>
                <Box display="flex" justifyContent="center" alignItems="center" height={150}>
                  <Typography variant="h4">
                    {numberOfProducts} sản phẩm
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <Card sx={{ backgroundColor: '#f5f5f5', boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Số Thành Viên
                </Typography>
                <Box display="flex" justifyContent="center" alignItems="center" height={150}>
                  <Typography variant="h4">
                    {numberOfMembers} thành viên
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <Card sx={{ backgroundColor: '#f5f5f5', boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Số Đơn Hàng Trong Ngày
                </Typography>
                <Box display="flex" justifyContent="center" alignItems="center" height={150}>
                  <Typography variant="h4">
                    {numberOfTodayOrders} đơn hàng
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
        <Card sx={{ backgroundColor: '#f5f5f5', boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Doanh Thu Trong Năm
            </Typography>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={salesByMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value, name) => name === 'Doanh Thu (Triệu)' ? (value * 1000000).toLocaleString("vi-VN") + " VND" : value} />
                  <Legend />
                  <Bar dataKey="Doanh Thu (Triệu)" fill="#8884d8" />
                  <Bar dataKey="Số Đơn Hàng" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </Grid>

      <Grid item xs={12} md={6} lg={6}>
        <Card sx={{ backgroundColor: '#f5f5f5', boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Doanh Thu Trong Tháng
            </Typography>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={salesByDate}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis/>
                  <Tooltip formatter={(value, name) => name === 'Doanh Thu (Triệu)' ? (value * 1000000).toLocaleString("vi-VN") + " VND" : value} />
                  <Legend />
                  <Line type="monotone" dataKey="Doanh Thu (Triệu)" stroke="#8884d8" />
                  <Line type="monotone" dataKey="Số Đơn Hàng" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <Card sx={{ backgroundColor: '#f5f5f5', boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Top Sản Phẩm Bán Chạy
                </Typography>
                <List>
                  {topSellingProducts.map((product) => (
                    <ListItem key={product.productId}>
                      <ListItemText
                        primary={product.productName}
                        secondary={`Tổng doanh thu của sản phẩm: ${product.totalMoney.toLocaleString("vi-VN")} VND`}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6} lg={6}>
            <Card sx={{ backgroundColor: '#f5f5f5', boxShadow: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Đơn Hàng Hiện Tại
                </Typography>
                <List>
                  {recentOrders.map((order) => (
                    <ListItem key={order.id}>
                      <ListItemText
                        primary={` ID: ${order.id}`}
                        secondary={`Khách hàng: ${order.customer} | Ngày: ${order.date} | Tổng: ${order.total.toLocaleString("vi-VN")} VND`}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Dashboard;
