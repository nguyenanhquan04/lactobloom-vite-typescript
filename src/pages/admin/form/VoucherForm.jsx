import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button, TextField, Grid, Select, MenuItem, InputLabel, FormControl
} from '@mui/material';
import Cookies from 'js-cookie';
import { saveVoucher, updateVoucherByVoucherId } from '../../../utils/VoucherService';

const VoucherForm = ({ onSave, initialVoucher }) => {
  const [voucher, setVoucher] = useState({
    point: '',
    discount: '',
    expirationDate: new Date(new Date().getTime() + 7 * 60 * 60 * 1000).toISOString().slice(0, 16),
    available: 'true'
  });

  useEffect(() => {
    if (initialVoucher) {
      const expirationDate = new Date(new Date(initialVoucher.expirationDate).getTime() + 7 * 60 * 60 * 1000).toISOString().slice(0, 16);
      setVoucher({
        ...initialVoucher,
        expirationDate: expirationDate
      });
    }
  }, [initialVoucher]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setVoucher(prevVoucher => ({
      ...prevVoucher,
      [name]: value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = Cookies.get('authToken');
    const voucherData = {
      point: voucher.point,
      discount: voucher.discount,
      expirationDate: voucher.expirationDate,
      available: voucher.available
    };

    try {
      if (initialVoucher) {
        await updateVoucherByVoucherId(token, voucherData, initialVoucher.voucherId);
      } else {
        await saveVoucher(token, voucherData);
      }
      onSave();
    } catch (error) {
      console.error('Error saving voucher:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ paddingTop: '20px' }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            name="point"
            label="Điểm"
            variant="outlined"
            fullWidth
            value={voucher.point || ''}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="discount"
            label="Giảm giá (%)"
            variant="outlined"
            fullWidth
            value={voucher.discount || ''}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="expirationDate"
            label="Ngày hết hạn"
            variant="outlined"
            fullWidth
            type="datetime-local"
            value={voucher.expirationDate || ''}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Trạng thái</InputLabel>
            <Select
              name="available"
              value={voucher.available}
              onChange={handleChange}
              label="Available"
              required
            >
              <MenuItem value="true">Khả dụng</MenuItem>
              <MenuItem value="false">Không khả dụng</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" type="submit">
            {initialVoucher ? 'Cập nhật' : 'Thêm'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default VoucherForm;
