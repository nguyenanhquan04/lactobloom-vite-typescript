import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button, TextField, Grid, FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import Cookies from 'js-cookie';
import { updateUserByUserId } from '../../../utils/UserService';

const UserForm = ({ onSave, initialUser }) => {
  const [user, setUser] = useState({
    fullName: '',
    role: '',
    email: '',
    phone: '',
    address: '',
    point: 0,
  });

  useEffect(() => {
    if (initialUser) {
      setUser(initialUser);
    }
  }, [initialUser]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUser({
      ...user,
      [name]: value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = Cookies.get('authToken');

    try {
      await updateUserByUserId(token, user, user.userId);
      onSave();
    } catch (error) {
      console.error('Error updating user:', error);
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
            value={user.fullName}
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
            value={user.email}
            onChange={handleChange}
            disabled
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="phone"
            label="Số điện thoại"
            variant="outlined"
            fullWidth
            type="tel"
            value={user.phone}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="address"
            label="Địa chỉ"
            variant="outlined"
            fullWidth
            value={user.address}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Vai trò</InputLabel>
            <Select
              name="role"
              value={user.role}
              onChange={handleChange}
              label="Role"
              required
            >
              <MenuItem value="MEMBER">Member</MenuItem>
              <MenuItem value="STAFF">Staff</MenuItem>
              <MenuItem value="ADMIN">Admin</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            name="point"
            label="Point"
            variant="outlined"
            fullWidth
            type="number"
            value={user.point}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" type="submit">
            Update User
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default UserForm;
