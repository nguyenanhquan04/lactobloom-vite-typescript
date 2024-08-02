import React, { useState, useEffect } from 'react';
import {
  Button, TextField, Grid, Select, MenuItem, InputLabel, FormControl
} from '@mui/material';
import { Editor } from '@tinymce/tinymce-react'; // Import TinyMCE Editor
import Cookies from 'js-cookie';
import { getAllBrands, getBrandByProductId } from '../../../utils/BrandService';
import { getAllCategories, getCategoryByProductId } from '../../../utils/CategoryService';
import { saveProduct, updateProductByProductId } from '../../../utils/ProductService';


const ProductForm = ({ onSave, initialProduct }) => {
  const [product, setProduct] = useState({
    productName: '',
    brandId: '',
    categoryId: '',
    price: '',
    stock: '',
    discount: '',
    description: '',
    longDescription: '',
    preOrder: false,
  });
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchBrandsAndCategories = async () => {
      try {
        const brandsResponse = await getAllBrands();
        setBrands(brandsResponse.data);
        const categoriesResponse = await getAllCategories();
        setCategories(categoriesResponse.data);
      } catch (error) {
        console.error('Error fetching brands and categories:', error);
      }
    };

    const fetchProductData = async () => {
      if (initialProduct) {
        try {
          const brandResponse = await getBrandByProductId(initialProduct.productId);
          const categoryResponse = await getCategoryByProductId(initialProduct.productId);
          setProduct({
            ...initialProduct,
            brandId: brandResponse.data.brandId,
            categoryId: categoryResponse.data.categoryId
          });
        } catch (error) {
          console.error('Error fetching product data:', error);
        }
      }
    };

    fetchBrandsAndCategories();
    fetchProductData();
  }, [initialProduct]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProduct(prevProduct => ({
      ...prevProduct,
      [name]: name === 'preOrder' ? JSON.parse(value) : value || ''
    }));
  };

  const handleLongDescriptionChange = (content) => {
    setProduct(prevProduct => ({
      ...prevProduct,
      longDescription: content
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const token = Cookies.get('authToken');
    const { brandId, categoryId } = product;
    try {
      if (initialProduct) {
        await updateProductByProductId(token, product, initialProduct.productId, brandId, categoryId);
      } else {
        await saveProduct(token, product, brandId, categoryId);
      }
      onSave();
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ paddingTop: '20px' }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            name="productName"
            label="Tên sản phẩm"
            variant="outlined"
            fullWidth
            value={product.productName}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Thương hiệu</InputLabel>
            <Select
              name="brandId"
              value={product.brandId}
              onChange={handleChange}
              label="Brand"
              required
            >
              {brands.map((brand) => (
                <MenuItem key={brand.brandId} value={brand.brandId}>
                  {brand.brandName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={6}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Danh mục</InputLabel>
            <Select
              name="categoryId"
              value={product.categoryId}
              onChange={handleChange}
              label="Category"
              required
            >
              {categories.map((category) => (
                <MenuItem key={category.categoryId} value={category.categoryId}>
                  {category.categoryName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <TextField
            name="description"
            label="Mô tả"
            variant="outlined"
            fullWidth
            rows={4}
            value={product.description}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
        <Editor
            apiKey="36mfugt4eg3kx7ijc7n42t12i9py5q635msod4bu5jybwe6e"
            init={{
              height: 500,
              menubar: false,
              plugins:
                "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate mentions tableofcontents footnotes mergetags autocorrect typography inlinecss markdown",
              toolbar:
                "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat",
            }}
            value={product.longDescription || ""}
            onEditorChange={handleLongDescriptionChange}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <TextField
            name="price"
            label="Giá"
            variant="outlined"
            fullWidth
            type="number"
            value={product.price}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            name="stock"
            label="Kho"
            variant="outlined"
            fullWidth
            type="number"
            value={product.stock}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            name="discount"
            label="Giảm (%)"
            variant="outlined"
            fullWidth
            type="number"
            inputProps={{ min: 0, max: 100 }}
            value={product.discount}
            onChange={handleChange}
            required
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <FormControl variant="outlined" fullWidth>
            <InputLabel>Pre Order</InputLabel>
            <Select
              name="preOrder"
              value={product.preOrder}
              onChange={handleChange}
              label="Pre Order"
              required
            >
              <MenuItem value={true}>Cho phép đặt trước</MenuItem>
              <MenuItem value={false}>Không cho phép đặt trước</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12}>
          <Button variant="contained" color="primary" type="submit">
            {initialProduct ? 'Cập nhật' : 'Thêm'}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};

export default ProductForm;