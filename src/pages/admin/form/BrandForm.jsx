import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button, TextField, Grid
} from '@mui/material';
import Cookies from 'js-cookie';
import { saveBrand, updateBrandByBrandId } from '../../../utils/BrandService';

const BrandForm = ({ onSave, initialBrand }) => {
  const [brand, setBrand] = useState({
    brandName: ''
  });

  useEffect(() => {
    if (initialBrand) {
      setBrand({
        brandName: initialBrand.brandName
      });
    }
  }, [initialBrand]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setBrand({
      ...brand,
      [name]: value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = Cookies.get('authToken');
    try {
      if (initialBrand) {
        await updateBrandByBrandId(token, brand, initialBrand.brandId);
      } else {
        await saveBrand(token, brand);
      }
      onSave();
    } catch (error) {
      console.error('Error saving brand:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ paddingTop: '20px' }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            name="brandName"
            label="Tên thương hiệu"
            variant="outlined"
            fullWidth
            value={brand.brandName}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" type="submit">
            {initialBrand ? 'Cập nhật' : 'Thêm'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default BrandForm;
