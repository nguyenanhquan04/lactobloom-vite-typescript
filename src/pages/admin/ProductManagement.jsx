import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button,
  TextField, IconButton, TablePagination, MenuItem, Select, FormControl, InputLabel, Grid, Dialog, DialogContent, DialogTitle
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ImageIcon from '@mui/icons-material/Image';
import Cookies from 'js-cookie';
import ProductForm from './form/ProductForm';
import ImageForm from './form/ImageForm';
import { getAllBrands } from '../../utils/BrandService';
import { deleteProductByProductId, getAllProducts } from '../../utils/ProductService';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [open, setOpen] = useState(false);
  const [initialProduct, setInitialProduct] = useState(null);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await getAllBrands();
        setBrands(response.data);
      } catch (error) {
        console.error('Error fetching brands:', error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await getAllProducts();
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchBrands();
    fetchProducts();
  }, []);

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value);
  };

  const handleDelete = async (productId) => {
    const token = Cookies.get('authToken');
    if (window.confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      try {
        await deleteProductByProductId(token, productId);
        setProducts(products.filter((product) => product.productId !== productId));
      } catch (error) {
        console.error('Error deleting product:', error);
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

  const handleBrandChange = (event) => {
    setSelectedBrand(event.target.value);
    setPage(0);
  };

  const handleAddProduct = () => {
    setInitialProduct(null);
    setOpen(true);
  };

  const handleEditProduct = (product) => {
    setInitialProduct(product);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSave = () => {
    // Refresh the product list
    getAllProducts()
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error('Error fetching products:', error);
      });
    setOpen(false);
  };

  const handleOpenImageDialog = (product) => {
    setSelectedProduct(product);
    setImageDialogOpen(true);
  };

  const handleCloseImageDialog = () => {
    setImageDialogOpen(false);
    setSelectedProduct(null);
  };

  const filteredProducts = products.filter((product) =>
    product.productName.toLowerCase().includes(searchValue.toLowerCase())
  );

  const displayedProducts = selectedBrand === 'all'
    ? filteredProducts
    : filteredProducts.filter((product) => product.brandName === selectedBrand);

  const paginatedProducts = displayedProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div className="product-management-container">
      <h1>Quản lý sản phẩm</h1>
      <Grid container spacing={0} alignItems="center" className="product-management-controls">
        <Grid item xs={12} md={9}>
          <TextField
            label="Tìm sản phẩm.."
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
            className="product-management-add-button"
            onClick={handleAddProduct}
          >
            Thêm sản phẩm
          </Button>
        </Grid>
      </Grid>
      <FormControl variant="outlined" fullWidth className="product-management-brand-select">
        <InputLabel>Thương hiệu</InputLabel>
        <Select
          value={selectedBrand}
          onChange={handleBrandChange}
          label="Brand"
        >
          <MenuItem value="all">Tất cả</MenuItem>
          {brands.map((brand) => (
            <MenuItem key={brand.brandId} value={brand.brandName}>
              {brand.brandName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <TableContainer component={Paper} className="product-management-table-container">
        <Table className="product-management-table">
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tên</TableCell>
              <TableCell>Thương hiệu</TableCell>
              <TableCell>Danh mục</TableCell>
              <TableCell>Giá</TableCell>
              <TableCell>Kho</TableCell>
              <TableCell>Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedProducts.map((product) => (
              <TableRow key={product.productId}>
                <TableCell>{product.productId}</TableCell>
                <TableCell>{product.productName}</TableCell>
                <TableCell>{product.brandName}</TableCell>
                <TableCell>{product.categoryName}</TableCell>
                <TableCell>{product.price.toLocaleString("vi-VN")}</TableCell>
                <TableCell>{product.stock}</TableCell>
                <TableCell className="product-management-actions">
                  <IconButton onClick={() => handleEditProduct(product)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(product.productId)}>
                    <DeleteIcon />
                  </IconButton>
                  <IconButton onClick={() => handleOpenImageDialog(product)}>
                    <ImageIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={displayedProducts.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[15, 30, 50]}
          className="product-management-pagination"
        />
      </TableContainer>
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
        <DialogTitle>{initialProduct ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm'}</DialogTitle>
        <DialogContent>
          <ProductForm onSave={handleSave} initialProduct={initialProduct} />
        </DialogContent>
      </Dialog>
      <ImageForm
        open={imageDialogOpen}
        onClose={handleCloseImageDialog}
        product={selectedProduct}
        onSave={handleSave}
      />
    </div>
  );
};

export default ProductManagement;
