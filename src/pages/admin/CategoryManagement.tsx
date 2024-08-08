import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button,
  TextField, IconButton, TablePagination, Grid, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Cookies from 'js-cookie';
import CategoryForm from './form/CategoryForm'; // Make sure to import your CategoryForm component
import { deleteCategorydByCategoryId, getAllCategories } from '../../utils/CategoryService';
import { getProductsByCategoryId } from '../../utils/ProductService';

interface CountMap {
  [key: string]: any;
}

interface UpdatedCountMap {
  [key: string]: any;
}

interface ProductCountMap {
  [key: string]: any;
}

const CategoryManagement = () => {
  const [categories, setCategories] = useState([]);
  const [productCounts, setProductCounts] = useState<ProductCountMap>({});
  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [openForm, setOpenForm] = useState(false);
  const [formMode, setFormMode] = useState('add'); // 'add' or 'edit'
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await getAllCategories();
      const categoriesData = response.data;
      setCategories(categoriesData);

      // Fetch product count for each category
      const counts: CountMap = {};
      for (const category of categoriesData) {
        const countResponse = await getProductsByCategoryId(category.categoryId);
        counts[category.categoryId] = countResponse.data.length;
      }
      setProductCounts(counts);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleSearchChange = (event: any) => {
    setSearchValue(event.target.value);
  };

  const handleDelete = async (categoryId: number) => {
    const token = Cookies.get("authToken") as string;
    if (window.confirm('Bạn có chắc muốn xóa danh mục này?')) {
      try {
        await deleteCategorydByCategoryId(token, categoryId);
        setCategories(categories.filter(category => category.categoryId !== categoryId));
        const updatedCounts: UpdatedCountMap = { ...productCounts };
        delete updatedCounts[categoryId];
        setProductCounts(updatedCounts);
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const handleOpenForm = (mode: any, category = null) => {
    setFormMode(mode);
    setSelectedCategory(category);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedCategory(null);
  };

  const handleFormSave = async () => {
    handleCloseForm();
    // Re-fetch categories after save
    await fetchCategories();
  };

  const handleChangePage = (newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredCategories = categories.filter(category =>
    category.categoryName.toLowerCase().includes(searchValue.toLowerCase())
  );

  const paginatedCategories = filteredCategories.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div className="category-management-container">
      <h1>Quản lý danh mục sản phẩm</h1>
      <Grid container spacing={0} alignItems="center" className="category-management-controls">
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
            className="category-management-add-button"
            onClick={() => handleOpenForm('add')}
          >
            Thêm danh mục
          </Button>
        </Grid>
      </Grid>
      <TableContainer component={Paper} className="category-management-table-container">
        <Table className="category-management-table">
          <TableHead>
            <TableRow>
              <TableCell className="category-management-id-cell">ID</TableCell>
              <TableCell>Tên</TableCell>
              <TableCell>Số lượng sản phẩm</TableCell> {/* New column for product count */}
              <TableCell className="actions-cell">Thao tác</TableCell>              
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedCategories.map((category: any) => (
              <TableRow key={category.categoryId}>
                <TableCell className="category-management-id-cell">{category.categoryId}</TableCell>
                <TableCell>{category.categoryName}</TableCell>
                <TableCell>{productCounts[category.categoryId] || 0} sản phẩm</TableCell> {/* Display product count */}
                <TableCell className="category-management-actions">
                  <IconButton onClick={() => handleOpenForm('edit', category)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(category.categoryId)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
               
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filteredCategories.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[15, 30, 50]}
          className="category-management-pagination"
        />
      </TableContainer>

      {/* Category Form Dialog */}
      <Dialog open={openForm} onClose={handleCloseForm} fullWidth>
        <DialogTitle>{formMode === 'add' ? 'Thêm danh mục' : 'Cập nhật danh mục'}</DialogTitle>
        <DialogContent>
          <CategoryForm
            onSave={handleFormSave}
            initialCategory={formMode === 'edit' ? selectedCategory : null}
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

export default CategoryManagement;
