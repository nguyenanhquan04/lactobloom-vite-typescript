import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {jwtDecode} from 'jwt-decode'; // Import jwtDecode
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button,
  TextField, IconButton, TablePagination, MenuItem, Select, FormControl, InputLabel, Grid, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Cookies from 'js-cookie';
import UserForm from './form/UserForm'; // Import the UserForm component
import { deleteUserByUserId, getAllUsers } from '../../utils/UserService';

const translateRole = (role) => {
  switch (role) {
    case 'ADMIN':
      return 'Admin';
    case 'STAFF':
      return 'Nhân viên';
    case 'MEMBER':
      return 'Thành viên';
    default:
      return role;
  }
};

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [selectedRole, setSelectedRole] = useState('all');
  const [editUser, setEditUser] = useState(null);
  const [open, setOpen] = useState(false); // State to handle dialog open/close
  const [currentUserEmail, setCurrentUserEmail] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      const token = Cookies.get('authToken');
      try {
        const decodedToken = jwtDecode(token);
        const userEmail = decodedToken.sub;
        setCurrentUserEmail(userEmail);

        const response = await getAllUsers(token);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleDelete = async (userId) => {
    const token = Cookies.get('authToken');
    if (window.confirm('Bạn có chắc muốn xóa người dùng này?')) {
      try {
        await deleteUserByUserId(token, userId);
        setUsers(users.filter(user => user.userId !== userId));
      } catch (error) {
        console.error('Error deleting user:', error);
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

  const handleRoleChange = (event) => {
    setSelectedRole(event.target.value);
    setPage(0);
  };

  const handleEditUser = (user) => {
    setEditUser(user);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditUser(null);
  };

  const handleSave = () => {
    // Fetch updated users after saving
    const fetchUsers = async () => {
      const token = Cookies.get('authToken');
      try {
        const response = await getAllUsers(token);
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
    handleClose();
  };

  // Filter out the current user from the user list
  const filteredUsers = users
    .filter(user => user.fullName.toLowerCase().includes(searchValue.toLowerCase()))
    .filter(user => user.email !== currentUserEmail); // Exclude current user

  const displayedUsers = selectedRole === 'all'
    ? filteredUsers
    : filteredUsers.filter(user => user.role === selectedRole);

  const paginatedUsers = displayedUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div className="user-management-container">
      <h1>Quản lý người dùng</h1>
      <Grid container spacing={0} alignItems="center" className="user-management-controls">
        <Grid item xs={12} md={9}>
          <TextField
            label="Tìm người dùng"
            variant="outlined"
            value={searchValue}
            onChange={handleSearchChange}
            fullWidth
          />
        </Grid>
      </Grid>
      <FormControl variant="outlined" fullWidth className="user-management-role-select">
        <InputLabel>Vai trò</InputLabel>
        <Select
          value={selectedRole}
          onChange={handleRoleChange}
          label="Role"
        >
          <MenuItem value="all">Tất cả người dùng</MenuItem>
          <MenuItem value="ADMIN">Admin</MenuItem>
          <MenuItem value="STAFF">Nhân viên</MenuItem>
          <MenuItem value="MEMBER">Thành viên</MenuItem>
        </Select>
      </FormControl>
      <TableContainer component={Paper} className="user-management-table-container">
        <Table className="user-management-table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Họ tên</TableCell>
              <TableCell>Vai trò</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Số điện thoại</TableCell>
              <TableCell>Địa chỉ</TableCell>
              <TableCell>Điểm</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedUsers.map((user) => (
              <TableRow key={user.userId}>
                <TableCell>{user.userId}</TableCell>
                <TableCell>{user.fullName}</TableCell>
                <TableCell>{translateRole(user.role)}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.phone}</TableCell>
                <TableCell>{user.address}</TableCell>
                <TableCell>{user.point}</TableCell>
                <TableCell className="user-management-actions">
                  <IconButton onClick={() => handleEditUser(user)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(user.userId)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={displayedUsers.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[15, 30, 50]}
          className="user-management-pagination"
        />
      </TableContainer>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Cập Nhật Người Dùng</DialogTitle>
        <DialogContent>
          <UserForm onSave={handleSave} initialUser={editUser} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Hủy</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default UserManagement;
