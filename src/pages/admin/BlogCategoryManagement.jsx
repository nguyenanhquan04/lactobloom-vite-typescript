import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button,
  TextField, IconButton, TablePagination, Grid, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Cookies from 'js-cookie';
import BlogCategoryForm from './form/BlogCategoryForm'; // Import your BlogCategoryForm component
import { deleteBlogCategory, getAllBlogCategories } from '../../utils/BlogCategoryService';
import { getBlogByBlogCategoryId } from '../../utils/BlogService';

const BlogCategoryManagement = () => {
  const [blogCategories, setBlogCategories] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [openForm, setOpenForm] = useState(false);
  const [formMode, setFormMode] = useState('add'); // 'add' or 'edit'
  const [selectedBlogCategory, setSelectedBlogCategory] = useState(null);
  const [postCounts, setPostCounts] = useState({});

  useEffect(() => {
    const fetchBlogCategories = async () => {
      try {
        const response = await getAllBlogCategories();
        setBlogCategories(response.data);
        const counts = {};
        for (const category of response.data) {
          const postsResponse = await getBlogByBlogCategoryId(category.blogCategoryId);
          counts[category.blogCategoryId] = postsResponse.data.length;
        }
        setPostCounts(counts);
      } catch (error) {
        console.error('Error fetching blog categories:', error);
      }
    };

    fetchBlogCategories();
  }, []);

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleDelete = async (blogCategoryId) => {
    const token = Cookies.get("authToken");
    if (window.confirm('Bạn có chắc muốn xóa danh mục này?')) {
      try {
        await deleteBlogCategory(token, blogCategoryId);
        setBlogCategories(blogCategories.filter(blogCategory => blogCategory.blogCategoryId !== blogCategoryId));
        const updatedCounts = { ...postCounts };
        delete updatedCounts[blogCategoryId];
        setPostCounts(updatedCounts);
      } catch (error) {
        console.error('Error deleting blog category:', error);
      }
    }
  };

  const handleOpenForm = (mode, blogCategory = null) => {
    setFormMode(mode);
    setSelectedBlogCategory(blogCategory);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedBlogCategory(null);
  };

  const handleFormSave = async () => {
    handleCloseForm();
    // Re-fetch categories after save
    await fetchBlogCategories();
  };

  const fetchBlogCategories = async () => {
    try {
      const response = await getAllBlogCategories();
      setBlogCategories(response.data);
      const counts = {};
      for (const category of response.data) {
        const postsResponse = await getBlogByBlogCategoryId(category.blogCategoryId);
        counts[category.blogCategoryId] = postsResponse.data.length;
      }
      setPostCounts(counts);
    } catch (error) {
      console.error('Error fetching blog categories:', error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredBlogCategories = blogCategories.filter(blogCategory =>
    blogCategory.blogCategoryName.toLowerCase().includes(searchValue.toLowerCase())
  );

  const paginatedBlogCategories = filteredBlogCategories.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div className="blog-category-management-container">
      <h1>Quản lý danh mục bài viết</h1>
      <Grid container spacing={0} alignItems="center" className="blog-category-management-controls">
        <Grid item xs={12} md={9}>
          <TextField
            label="Tìm danh mục"
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
            className="blog-category-management-add-button"
            onClick={() => handleOpenForm('add')}
          >
            Thêm danh mục
          </Button>
        </Grid>
      </Grid>
      <TableContainer component={Paper} className="blog-category-management-table-container">
        <Table className="blog-category-management-table">
          <TableHead>
            <TableRow>
              <TableCell className="blog-category-management-id-cell">ID</TableCell>
              <TableCell>Tên</TableCell>
              <TableCell>Số lượng bài viết</TableCell>
              <TableCell className="actions-cell">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedBlogCategories.map((blogCategory) => (
              <TableRow key={blogCategory.blogCategoryId}>
                <TableCell className="blog-category-management-id-cell">{blogCategory.blogCategoryId}</TableCell>
                <TableCell>{blogCategory.blogCategoryName}</TableCell>
                <TableCell>{postCounts[blogCategory.blogCategoryId] || 0} bài</TableCell>
                <TableCell className="blog-category-management-actions">
                  <IconButton onClick={() => handleOpenForm('edit', blogCategory)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(blogCategory.blogCategoryId)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filteredBlogCategories.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[15, 30, 50]}
          className="blog-category-management-pagination"
        />
      </TableContainer>

      {/* Blog Category Form Dialog */}
      <Dialog open={openForm} onClose={handleCloseForm} fullWidth>
        <DialogTitle>{formMode === 'add' ? 'Thêm danh mục bài viết' : 'Cập nhật danh mục bài viết'}</DialogTitle>
        <DialogContent>
          <BlogCategoryForm
            onSave={handleFormSave}
            initialCategory={formMode === 'edit' ? selectedBlogCategory : null}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseForm} color="primary">
            Hủy
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default BlogCategoryManagement;
