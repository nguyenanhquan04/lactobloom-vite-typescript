import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button,
  IconButton, TablePagination, Grid, FormControl, InputLabel, Select, MenuItem, Dialog,
  DialogActions, DialogContent, DialogTitle, TextField
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import Cookies from "js-cookie";
import OrderForm from './form/OrderForm'; // Ensure this path is correct
import {jwtDecode} from "jwt-decode"; // Import jwtDecode correctly
import { deleteOrderByOrderId, deliverOrderByOrderId, getAllOrders, getStaffOrders } from '../../utils/OrderService';


const translateStatus = (status) => {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'Đang chờ xử lý';
    case 'delivered':
      return 'Đã giao hàng';
    case 'cancelled':
      return 'Đã hủy';
    default:
      return status;
  }
};

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [editOrder, setEditOrder] = useState(null);
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      const token = Cookies.get("authToken");
      const decodedToken = jwtDecode(token);

      try {
        let response;
        if (decodedToken.role === 'ADMIN') {
          response = await getAllOrders(token);
        } else if (decodedToken.role === 'STAFF') {
          response = await getStaffOrders(token);
        }

        if (response) {
          // Sort orders by orderDate in descending order
          const sortedOrders = response.data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
          setOrders(sortedOrders);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const handleDelete = async (orderId) => {
    const token = Cookies.get("authToken");
    if (window.confirm('Bạn có chắc muốn xóa đơn hàng này?')) {
      try {
        await deleteOrderByOrderId(token, orderId);
        setOrders(orders.filter(order => order.orderId !== orderId));
      } catch (error) {
        console.error('Error deleting order:', error);
      }
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStatusChange = (event) => {
    setSelectedStatus(event.target.value);
    setPage(0);
  };

  const handleEdit = (order) => {
    setEditOrder(order);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditOrder(null);
  };

  const handleSave = () => {
    handleClose();
    // Refresh the order list after saving
    const fetchOrders = async () => {
      const token = Cookies.get("authToken");
      try {
        const response = await getAllOrders(token);
        // Sort orders by orderDate in descending order
        const sortedOrders = response.data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
        setOrders(sortedOrders);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };
    fetchOrders();
  };

  const handleDeliver = async (orderId) => {
    const token = Cookies.get("authToken");
    try {
      await deliverOrderByOrderId(token, orderId);
      setOrders(orders.map(order => 
        order.orderId === orderId ? { ...order, status: 'DELIVERED' } : order
      ));
    } catch (error) {
      console.error('Error marking order as delivered:', error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const filteredOrders = orders.filter(order => {
    if (selectedStatus === 'all') return true;
    return order.status === selectedStatus.toUpperCase();
  }).filter(order => 
    order.fullName.toLowerCase().includes(searchValue.toLowerCase())
  );

  const paginatedOrders = filteredOrders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div className="order-management-container">
      <h1>Quản lý đơn hàng</h1>
      <Grid container spacing={0} alignItems="center" className="order-management-controls">
        <Grid item xs={12} md={6}>
          <TextField
            label="Tìm đơn hàng"
            variant="outlined"
            value={searchValue}
            onChange={handleSearchChange}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              value={selectedStatus}
              onChange={handleStatusChange}
              label="Status"
            >
              <MenuItem value="all">Tất cả đơn hàng</MenuItem>
              <MenuItem value="pending">Đang chờ xử lí</MenuItem>
              <MenuItem value="delivered">Đã giao hàng</MenuItem>
              <MenuItem value="cancelled">Đã hủy</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <TableContainer component={Paper} className="order-management-table-container">
        <Table className="order-management-table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Họ tên</TableCell>
              
              <TableCell>Số điện thoại</TableCell>
              <TableCell>Địa chỉ</TableCell>
              <TableCell>Giá trị đơn hàng</TableCell>
              <TableCell>Phương thức thanh toán</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Nhân viên xử lý</TableCell>
              <TableCell>Ngày đặt</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedOrders.map((order) => (
              <TableRow key={order.orderId}>
                <TableCell>{order.orderId}</TableCell>
                <TableCell>{order.fullName}</TableCell>
                <TableCell>{order.phone}</TableCell>
                <TableCell>{order.address}</TableCell>
                <TableCell>{order.totalPrice.toLocaleString("vi-VN") + " VND"}</TableCell>
                <TableCell>{order.cod ? "Thanh toán COD" : "Chuyển khoản ngân hàng"}</TableCell>
                <TableCell>{translateStatus(order.status)}</TableCell>
                <TableCell>{order.staffName ?? "Chưa có"}</TableCell>
                <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                <TableCell className="order-management-actions">
                  <IconButton onClick={() => handleDelete(order.orderId)}>
                    <DeleteIcon />
                  </IconButton>
                  {order.status === 'PENDING' && (
                  <IconButton onClick={() => handleEdit(order)}>
                    <EditIcon />
                  </IconButton>
                )}
                  {order.status === 'PENDING' && (
                    <IconButton onClick={() => handleDeliver(order.orderId)}>
                      <CheckCircleIcon/>
                    </IconButton>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filteredOrders.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[15, 30, 50]}
          className="order-management-pagination"
        />
      </TableContainer>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Cập nhật đơn hàng</DialogTitle>
        <DialogContent>
          <OrderForm onSave={handleSave} initialOrder={editOrder} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Hủy
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default OrderManagement;
