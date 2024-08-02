import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button,
  TextField, IconButton, TablePagination, Grid, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Cookies from 'js-cookie';
import BrandForm from './form/BrandForm'; // Make sure to import your BrandForm component
import { deleteBrandByBrandId, getAllBrands } from '../../utils/BrandService';
import { getProductsByBrandId } from '../../utils/ProductService';

const BrandManagement = () => {
  const [brands, setBrands] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [openForm, setOpenForm] = useState(false);
  const [formMode, setFormMode] = useState('add'); // 'add' or 'edit'
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [productCounts, setProductCounts] = useState({}); // State to store product counts

  // Define fetchBrands function
  const fetchBrands = async () => {
    try {
      const response = await getAllBrands();
      const brandsData = response.data;
      setBrands(brandsData);

      // Fetch product counts for each brand
      const counts = {};
      for (const brand of brandsData) {
        try {
          const productResponse = await getProductsByBrandId(brand.brandId);
          counts[brand.brandId] = productResponse.data.length;
        } catch (error) {
          console.error(`Error fetching products for brand ${brand.brandId}:`, error);
          counts[brand.brandId] = 0;
        }
      }
      setProductCounts(counts);
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleDelete = async (brandId) => {
    const token = Cookies.get("authToken");
    if (window.confirm('Bạn có chắc muốn xóa thương hiệu này?')) {
      try {
        await deleteBrandByBrandId(token, brandId);
        setBrands(brands.filter(brand => brand.brandId !== brandId));
        const updatedCounts = { ...productCounts };
        delete updatedCounts[brandId];
        setProductCounts(updatedCounts);
      } catch (error) {
        console.error('Error deleting brand:', error);
      }
    }
  };

  const handleOpenForm = (mode, brand = null) => {
    setFormMode(mode);
    setSelectedBrand(brand);
    setOpenForm(true);
  };

  const handleCloseForm = () => {
    setOpenForm(false);
    setSelectedBrand(null);
  };

  // Update handleFormSave to call fetchBrands
  const handleFormSave = () => {
    handleCloseForm();
    fetchBrands(); // Ensure fetchBrands is called
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const filteredBrands = brands.filter(brand =>
    brand.brandName.toLowerCase().includes(searchValue.toLowerCase())
  );

  const paginatedBrands = filteredBrands.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div className="brand-management-container">
      <h1>Quản lý thương hiệu sản phẩm</h1>
      <Grid container spacing={0} alignItems="center" className="brand-management-controls">
        <Grid item xs={12} md={9}>
          <TextField
            label="Tìm thương hiệu"
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
            className="brand-management-add-button"
            onClick={() => handleOpenForm('add')}
          >
            Thêm thương hiệu
          </Button>
        </Grid>
      </Grid>
      <TableContainer component={Paper} className="brand-management-table-container">
        <Table className="brand-management-table">
          <TableHead>
            <TableRow>
              <TableCell className="brand-management-id-cell">ID</TableCell>
              <TableCell>Tên</TableCell>
              <TableCell>Số lượng sản phẩm</TableCell> {/* New Column */}
              <TableCell className="actions-cell">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedBrands.map((brand) => (
              <TableRow key={brand.brandId}>
                <TableCell className="brand-management-id-cell">{brand.brandId}</TableCell>
                <TableCell>{brand.brandName}</TableCell>
                <TableCell>{productCounts[brand.brandId] || 0} sản phẩm</TableCell> {/* Display product count */}
                <TableCell className="brand-management-actions">
                  <IconButton onClick={() => handleOpenForm('edit', brand)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(brand.brandId)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={filteredBrands.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[15, 30, 50]}
          className="brand-management-pagination"
        />
      </TableContainer>

      {/* Brand Form Dialog */}
      <Dialog open={openForm} onClose={handleCloseForm} fullWidth>
        <DialogTitle>{formMode === 'add' ? 'Thêm thương hiệu' : 'Cập nhật thương hiệu'}</DialogTitle>
        <DialogContent>
          <BrandForm
            onSave={handleFormSave}
            initialBrand={formMode === 'edit' ? selectedBrand : null}
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

export default BrandManagement;
