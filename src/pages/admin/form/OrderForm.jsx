import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';
import {
  Button, TextField, Grid, FormControl, InputLabel, Select, MenuItem, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';
import Cookies from 'js-cookie';
import { getOrderProducts } from '../../../utils/OrderDetailService';
import { getAllStaffs } from '../../../utils/UserService';
import { updateOrder } from '../../../utils/OrderService';

const OrderForm = ({ onSave, initialOrder }) => {
  const [order, setOrder] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    note: '',
    shippingFee: '',
    totalPrice: '',
    status: 'PENDING', // default status
    orderDate: ''
  });
  const [orderDetails, setOrderDetails] = useState([]);
  const [staffList, setStaffList] = useState([]);
  const [selectedStaffId, setSelectedStaffId] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = Cookies.get('authToken');
    if (token) {
      const decodedToken = jwtDecode(token);
      setIsAdmin(decodedToken.role === 'ADMIN');
      fetchStaffList(token);
    }
    if (initialOrder) {
      setOrder(initialOrder);
      fetchOrderDetails(initialOrder.orderId);
    }
  }, [initialOrder]);

  useEffect(() => {
    if (order.staffName && staffList.length > 0) {
      const matchedStaff = staffList.find(staff => staff.fullName === order.staffName);
      if (matchedStaff) {
        setSelectedStaffId(matchedStaff.userId);
      } else {
        setSelectedStaffId('');
      }
    }
  }, [order.staffName, staffList]);

  const fetchOrderDetails = async (orderId) => {
    const token = Cookies.get('authToken');
    try {
      const response = await getOrderProducts(token, orderId);
      setOrderDetails(response.data);
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  const fetchStaffList = async (token) => {
    try {
      const response = await getAllStaffs(token);
      setStaffList(response.data);
    } catch (error) {
      console.error('Error fetching staff list:', error);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setOrder({
      ...order,
      [name]: value
    });
  };

  const handleStaffChange = (event) => {
    setSelectedStaffId(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = Cookies.get('authToken');    
    try {
      await updateOrder(token, order, order.orderId, selectedStaffId);
      onSave();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ paddingTop: '20px' }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            name="fullName"
            label="Họ tên"
            variant="outlined"
            fullWidth
            value={order.fullName}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="email"
            label="Email"
            variant="outlined"
            fullWidth
            type="email"
            value={order.email}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="phone"
            label="Số điện thoại"
            variant="outlined"
            fullWidth
            type="tel"
            value={order.phone}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="address"
            label="Địa chỉ"
            variant="outlined"
            fullWidth
            value={order.address}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="note"
            label="Ghi chú"
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            value={order.note}
            onChange={handleChange}
            disabled
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="shippingFee"
            label="Phí ship"
            variant="outlined"
            fullWidth
            type="number"
            value={order.shippingFee}
            onChange={handleChange}
            disabled
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="totalPrice"
            label="Tổng giá trị đơn hàng"
            variant="outlined"
            fullWidth
            type="number"
            value={order.totalPrice}
            onChange={handleChange}
            disabled
          />
        </Grid>
        <Grid item xs={6}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              name="status"
              value={order.status}
              onChange={handleChange}
              label="Status"
              required
              disabled
            >
              <MenuItem value="PENDING">Đang giao</MenuItem>
              <MenuItem value="DELIVERED">Đã giao</MenuItem>
              <MenuItem value="CANCELLED">Đã hủy</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={6}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Nhân viên xử lý</InputLabel>
            <Select
              name="staffId"
              value={selectedStaffId}
              onChange={handleStaffChange}
              label="Nhân viên xử lý"
              required
              disabled={!isAdmin}
            >
              {staffList.map((staff) => (
                <MenuItem key={staff.userId} value={staff.userId}>
                  {staff.fullName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="orderDate"
            label="Ngày đặt"
            variant="outlined"
            fullWidth
            type="datetime-local"
            value={order.orderDate}
            onChange={handleChange}
            required
            InputLabelProps={{ shrink: true }}
            disabled
          />
        </Grid>
        {orderDetails.length > 0 && (
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tên sản phẩm</TableCell>
                    <TableCell>Số lượng</TableCell>
                    <TableCell>Thành tiền</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orderDetails.map((detail) => (
                    <TableRow key={detail.orderDetailId}>
                      <TableCell>{detail.productName}{detail.preOrder ? " (Đặt trước)": ""}</TableCell>
                      <TableCell>{detail.quantity}</TableCell>
                      <TableCell>{detail.totalPrice.toLocaleString("vi-VN") + " VND"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        )}
        <Grid item xs={12}>
          <Button variant="contained" color="primary" type="submit">
            Cập nhật
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default OrderForm;
