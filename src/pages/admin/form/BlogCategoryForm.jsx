import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button, TextField, Grid
} from '@mui/material';
import Cookies from 'js-cookie';
import { saveBlogCategory, updateBlogCategoryByBlogCategoryId } from '../../../utils/BlogCategoryService';

const BlogCategoryForm = ({ onSave, initialCategory }) => {
  const [blogCategory, setBlogCategory] = useState({
    blogCategoryName: ''
  });

  useEffect(() => {
    if (initialCategory) {
      setBlogCategory({
        blogCategoryName: initialCategory.blogCategoryName
      });
    }
  }, [initialCategory]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setBlogCategory({
      ...blogCategory,
      [name]: value
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = Cookies.get('authToken');
    try {
      if (initialCategory) {
        await updateBlogCategoryByBlogCategoryId(token, blogCategory, initialCategory.blogCategoryId);
      } else {
        await saveBlogCategory(token, blogCategory);
      }
      onSave();
    } catch (error) {
      console.error('Error saving blog category:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ paddingTop: '20px' }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            name="blogCategoryName"
            label="Tên danh mục bài viết"
            variant="outlined"
            fullWidth
            value={blogCategory.blogCategoryName}
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

export default BlogCategoryForm;
