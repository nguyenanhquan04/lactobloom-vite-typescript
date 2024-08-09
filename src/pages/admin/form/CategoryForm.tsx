import React, { useState, useEffect } from 'react';
import {
  Button, TextField, Grid
} from '@mui/material';
import Cookies from 'js-cookie';
import { saveCategory, updateCategoryByCategoryId } from '../../../utils/CategoryService';

interface CategoryProps {
  onSave: () => void;
  initialCategory: any;
}

const CategoryForm: React.FC<CategoryProps> = ({ onSave, initialCategory }) => {
  const [category, setCategory] = useState({
    categoryName: ''
  });

  useEffect(() => {
    if (initialCategory) {
      setCategory({
        categoryName: initialCategory.categoryName
      });
    }
  }, [initialCategory]);

  const handleChange = (event: any) => {
    const { name, value } = event.target;
    setCategory({
      ...category,
      [name]: value
    });
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const token = Cookies.get('authToken') as string;    
    try {
      if (initialCategory) {
        await updateCategoryByCategoryId(token, category, initialCategory.categoryId);
      } else {
        await saveCategory(token, category);
      }
      onSave();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ paddingTop: '20px' }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            name="categoryName"
            label="Tên danh mục"
            variant="outlined"
            fullWidth
            value={category.categoryName}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" type="submit">
            {initialCategory ? 'Cập nhật' : 'Thêm'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default CategoryForm;
