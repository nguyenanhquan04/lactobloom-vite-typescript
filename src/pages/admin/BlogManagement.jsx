import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button,
  TextField, IconButton, TablePagination, MenuItem, Select, FormControl, InputLabel, Grid,
  Dialog, DialogActions, DialogContent, DialogTitle
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Cookies from "js-cookie";
import BlogForm from './form/BlogForm';
import { getAllBlogCategories } from '../../utils/BlogCategoryService';
import { deleteBlogByBlogId, getAllBlogs } from '../../utils/BlogService';

const BlogManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [open, setOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllBlogCategories();
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const fetchBlogs = async () => {
      try {
        const response = await getAllBlogs();
        setBlogs(response.data);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchCategories();
    fetchBlogs();
  }, []);

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleDelete = async (blogId) => {
    const token = Cookies.get("authToken");
    if (window.confirm('Bạn có chắc muốn xóa Blog?')) {
      try {
        await deleteBlogByBlogId(token, blogId);
        setBlogs(blogs.filter(blog => blog.blogId !== blogId));
      } catch (error) {
        console.error('Error deleting blog:', error);
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

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
    setPage(0);
  };

  const handleAddBlog = () => {
    setEditingBlog(null);
    setOpen(true);
  };

  const handleEditBlog = (blog) => {
    setEditingBlog(blog);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    setOpen(false);
    // Refresh blogs list
    getAllBlogs()
      .then(response => setBlogs(response.data))
      .catch(error => console.error('Error fetching blogs:', error));
  };

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchValue.toLowerCase())
  );

  const displayedBlogs = selectedCategory === 'all'
    ? filteredBlogs
    : filteredBlogs.filter(blog => blog.blogCategoryName === selectedCategory);

  const paginatedBlogs = displayedBlogs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div className="blog-management-container">
      <h1>Quản lý bài viết</h1>
      <Grid container spacing={0} alignItems="center" className="blog-management-controls">
        <Grid item xs={12} md={9}>
          <TextField
            label="Tìm bài viết"
            variant="outlined"
            value={searchValue}
            onChange={handleSearchChange}
            fullWidth
          />
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            color="primary"
            className="blog-management-add-button"
            onClick={handleAddBlog}
          >
            Thêm bài viết
          </Button>
        </Grid>
      </Grid>
      <FormControl variant="outlined" fullWidth className="blog-management-category-select">
        <InputLabel>Danh mục</InputLabel>
        <Select
          value={selectedCategory}
          onChange={handleCategoryChange}
          label="Category"
        >
          <MenuItem value="all">Tất cả</MenuItem>
          {categories.map((category) => (
            <MenuItem key={category.blogCategoryId} value={category.blogCategoryName}>
              {category.blogCategoryName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TableContainer component={Paper} className="blog-management-table-container">
        <Table className="blog-management-table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Danh mục</TableCell>
              <TableCell>Tiêu đề</TableCell>
              <TableCell>Ngày đăng</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedBlogs.map((blog) => (
              <TableRow key={blog.blogId}>
                <TableCell>{blog.blogId}</TableCell>
                <TableCell>{blog.blogCategoryName}</TableCell>
                <TableCell>{blog.title}</TableCell>
                <TableCell>{new Date(blog.publishDate).toLocaleDateString()}</TableCell>
                <TableCell className="blog-management-actions">
                  <IconButton onClick={() => handleEditBlog(blog)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(blog.blogId)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={displayedBlogs.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[15, 30, 50]}
          className="blog-management-pagination"
        />
      </TableContainer>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{editingBlog ? 'Cập nhật bài viết' : 'Thêm bài viết'}</DialogTitle>
        <DialogContent>
          <BlogForm onSave={handleSave} initialBlog={editingBlog} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">Hủy</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BlogManagement;
